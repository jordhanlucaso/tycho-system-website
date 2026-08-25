/**
 * QA sweep for every client concept on demo.tychosystem.com.
 *
 * Crawls every route at mobile and desktop, and checks the things that actually break a
 * client demo: console errors, broken links, horizontal overflow, heading structure,
 * duplicated metadata, missing labels, touch-target size and WCAG AA contrast computed per
 * element against its resolved background.
 *
 * It also audits the raw served HTML, not just the DOM — see `auditRawHtml`. That is the
 * only check that can see an RSC flight-payload leak, and it is the reason this file exists
 * in the form it does.
 *
 * Run:  node scripts/qa.mjs [baseUrl]
 * Uses the system Chromium via playwright-core — no browser download.
 */

import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4311";
const SHOTS = process.env.SHOT_DIR ?? "qa-screenshots";

/** Mirrors lib/site.ts. On the demo host every page must carry a noindex directive. */
const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/**
 * Derived from the engagement registry, not kept by hand. A route list that has to be
 * updated separately is a route list that silently stops covering a new client's pages.
 *
 * Imported straight from the TypeScript source — Node strips the types natively, so there
 * is one definition of what this host serves rather than a copy that can drift.
 */
const { ALL_ROUTES } = await import("../src/data/engagements.ts");
const ROUTES = ALL_ROUTES;

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

/** Only these get written to disk — the brief asks for 390 and 1440. */
const SHOT_VIEWPORTS = new Set(["390", "1440"]);

const problems = [];
const notes = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

function fail(route, viewport, kind, detail) {
  problems.push({ route, viewport, kind, detail });
}

async function auditPage(page, route, viewport) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  const onConsole = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  const onPageError = (err) => pageErrors.push(String(err));
  const onFailed = (req) => failedRequests.push(`${req.method()} ${req.url()}`);
  const onResponse = (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onFailed);
  page.on("response", onResponse);

  const response = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });

  if (!response || response.status() >= 400) {
    fail(route, viewport.name, "http", `status ${response?.status()}`);
  }

  // Scroll the full page so every IntersectionObserver reveal fires before we measure.
  await page.evaluate(async () => {
    // `behavior: "instant"` is required: the sites set `scroll-behavior: smooth`, and a
    // smooth scroll never lands before the next step, so nothing ever intersects.
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 250));
  });

  const audit = await page.evaluate(() => {
    const out = {};
    const de = document.documentElement;

    out.overflow = de.scrollWidth - de.clientWidth;

    // Which element is wider than the viewport, if any.
    out.overflowCulprits = [];
    if (out.overflow > 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > de.clientWidth + 2 || r.left < -2) {
          out.overflowCulprits.push(
            `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ` +
              `[${Math.round(r.left)}..${Math.round(r.right)}]`,
          );
          if (out.overflowCulprits.length >= 5) break;
        }
      }
    }

    out.lang = de.getAttribute("lang");
    out.title = document.title;
    out.description =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null;
    out.canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
    out.robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null;
    out.ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? null;
    out.ogLocale = document.querySelector('meta[property="og:locale"]')?.getAttribute("content") ?? null;

    const h1s = [...document.querySelectorAll("h1")];
    out.h1Count = h1s.length;
    out.h1Text = h1s.map((h) => h.textContent.trim().slice(0, 80));

    // Heading level skips
    out.headingSkips = [];
    let prev = 0;
    for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const level = Number(h.tagName[1]);
      if (prev && level > prev + 1) {
        out.headingSkips.push(`${h.tagName} after H${prev}: ${h.textContent.trim().slice(0, 50)}`);
      }
      prev = level;
    }

    out.landmarks = {
      main: document.querySelectorAll("main").length,
      header: document.querySelectorAll("header").length,
      footer: document.querySelectorAll("footer").length,
      nav: document.querySelectorAll("nav").length,
    };

    out.jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try {
        return JSON.parse(s.textContent);
      } catch {
        return { __parseError: true };
      }
    });

    // Images without alt (there are none by design, but verify)
    out.imagesMissingAlt = [...document.querySelectorAll("img")].filter(
      (img) => img.getAttribute("alt") === null,
    ).length;

    // Form controls without an accessible name
    out.unlabelledFields = [];
    for (const el of document.querySelectorAll("input, select, textarea")) {
      if (el.type === "hidden") continue;
      const id = el.id;
      const hasLabel =
        (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
        el.closest("label") ||
        el.getAttribute("aria-label") ||
        el.getAttribute("aria-labelledby");
      if (!hasLabel) out.unlabelledFields.push(`${el.tagName.toLowerCase()}#${id || "(no id)"}`);
    }

    // Interactive targets smaller than 44x44 (excluding inline text links)
    out.smallTargets = [];
    for (const el of document.querySelectorAll("button, a[class], input[type=file], summary")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (getComputedStyle(el).display === "inline") continue;
      if (r.height < 40 || r.width < 24) {
        out.smallTargets.push(
          `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ` +
            `${Math.round(r.width)}x${Math.round(r.height)}`,
        );
      }
    }

    // Elements still invisible after a full scroll = a reveal that never fired.
    // Checks opacity AND clip-path: Stabukk hides content by clipping, not fading.
    const isHidden = (el) => {
      const s = getComputedStyle(el);
      if (s.opacity === "0") return true;
      const clip = s.clipPath;
      return clip !== "none" && /inset\(\s*100%/.test(clip);
    };
    out.stuckReveals = [...document.querySelectorAll(".reveal")].filter(
      (el) => isHidden(el) || [...el.children].some(isHidden),
    ).length;

    // --- WCAG AA contrast -------------------------------------------------
    // Walks every element that owns visible text, resolves the nearest opaque
    // background, and applies the 4.5:1 / 3:1 large-text threshold. Elements sitting on a
    // gradient or image background are skipped — the ratio is not well defined there.
    const srgb = (v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const parse = (str) => {
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const lum = ({ r, g, b }) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });

    out.contrast = [];
    for (const el of document.querySelectorAll("body *")) {
      const ownText = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join("")
        .trim();
      if (!ownText) continue;

      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (el.closest(".visually-hidden")) continue;
      // Purely decorative text (the Stabukk footer watermark) is aria-hidden and repeats
      // adjacent content verbatim, so it carries no information to lose.
      if (el.closest('[aria-hidden="true"]')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const fg = parse(cs.color);
      if (!fg || fg.a === 0) continue;

      // Resolve the painted background.
      let bg = null;
      let skip = false;
      for (let node = el; node; node = node.parentElement) {
        const s = getComputedStyle(node);
        if (s.backgroundImage && s.backgroundImage !== "none") {
          skip = true;
          break;
        }
        const c = parse(s.backgroundColor);
        if (c && c.a > 0) {
          bg = c.a === 1 ? c : null;
          if (bg) break;
          skip = true;
          break;
        }
      }
      if (skip || !bg) continue;

      const composited = fg.a < 1 ? over(fg, bg) : fg;
      const l1 = lum(composited);
      const l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;

      if (ratio < required - 0.01) {
        out.contrast.push(
          `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ` +
            `${ratio.toFixed(2)}:1 (needs ${required}) "${ownText.slice(0, 32)}"`,
        );
      }
    }
    out.contrast = [...new Set(out.contrast)].slice(0, 8);

    // Demo layer must not be present without ?demo=true
    out.demoNodes = document.querySelectorAll(".tsd-note, .tsd-control").length;

    out.links = [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/"));

    return out;
  });

  if (audit.overflow > 1) {
    fail(route, viewport.name, "overflow", `${audit.overflow}px — ${audit.overflowCulprits.join("; ")}`);
  }
  if (consoleErrors.length) fail(route, viewport.name, "console", consoleErrors.join(" | "));
  if (pageErrors.length) fail(route, viewport.name, "pageerror", pageErrors.join(" | "));
  if (failedRequests.length) {
    fail(route, viewport.name, "request", [...new Set(failedRequests)].join(" | "));
  }
  if (audit.stuckReveals > 0) {
    fail(route, viewport.name, "reveal", `${audit.stuckReveals} elements still opacity:0 after scroll`);
  }
  if (audit.demoNodes > 0) {
    fail(route, viewport.name, "demo-leak", `${audit.demoNodes} demo nodes present without ?demo=true`);
  }

  // Structural checks only need running once per route.
  if (viewport.name === "1440") {
    if (audit.lang !== "nb") fail(route, "-", "lang", `html lang="${audit.lang}"`);
    if (audit.h1Count !== 1) fail(route, "-", "h1", `${audit.h1Count} h1 elements: ${audit.h1Text.join(" / ")}`);
    if (audit.headingSkips.length) fail(route, "-", "heading-skip", audit.headingSkips.join("; "));
    if (audit.landmarks.main !== 1) fail(route, "-", "landmark", `main count = ${audit.landmarks.main}`);
    if (audit.imagesMissingAlt) fail(route, "-", "alt", `${audit.imagesMissingAlt} img without alt`);
    if (audit.contrast.length) fail(route, "-", "contrast", audit.contrast.join(" | "));
    if (audit.smallTargets.length) {
      notes.push(`${route}: small targets — ${audit.smallTargets.slice(0, 4).join(", ")}`);
    }
    if (audit.unlabelledFields.length) {
      fail(route, "-", "label", audit.unlabelledFields.join(", "));
    }
    if (!audit.canonical) fail(route, "-", "canonical", "missing");
    if (!audit.description) fail(route, "-", "description", "missing");
    if (audit.ogLocale !== "nb_NO") fail(route, "-", "og:locale", String(audit.ogLocale));
    if (audit.description && audit.description.length > 175) {
      notes.push(`${route}: meta description ${audit.description.length} chars (>175)`);
    }
    if (audit.title.length > 65) notes.push(`${route}: title ${audit.title.length} chars (>65)`);

    // The hub and every proposal are internal wherever they are hosted. Everything else is
    // a client-facing page — indexable only once that client's concept has its own domain,
    // which is exactly what INDEXABLE means. On the demo host, noindex everywhere is the
    // correct result, not a defect.
    const noindex = (audit.robots ?? "").includes("noindex");
    const internal = route === "/" || route.startsWith("/proposal");
    if ((internal || !INDEXABLE) && !noindex) {
      fail(route, "-", "robots", "route is indexable but must not be");
    }
    if (!internal && INDEXABLE && noindex) {
      fail(route, "-", "robots", "public route is noindexed");
    }

    const dupTitle = seenTitles.get(audit.title);
    if (dupTitle) fail(route, "-", "dup-title", `same title as ${dupTitle}`);
    else seenTitles.set(audit.title, route);

    const dupDesc = seenDescriptions.get(audit.description);
    if (dupDesc) fail(route, "-", "dup-description", `same description as ${dupDesc}`);
    else seenDescriptions.set(audit.description, route);

    // Structured data must never carry an unconfirmed value.
    const raw = JSON.stringify(audit.jsonLd);
    if (raw.includes("TO_CONFIRM")) fail(route, "-", "jsonld", "contains TO_CONFIRM");
    if (raw.includes("aggregateRating")) fail(route, "-", "jsonld", "self-serving review markup");
    if (audit.jsonLd.some((d) => d.__parseError)) fail(route, "-", "jsonld", "invalid JSON");
  }

  if (SHOT_VIEWPORTS.has(viewport.name)) {
    const name = route === "/" ? "index" : route.slice(1).replace(/\//g, "-");
    await page.screenshot({
      path: path.join(SHOTS, `${name}@${viewport.name}.png`),
      fullPage: true,
    });
  }

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("requestfailed", onFailed);
  page.off("response", onResponse);

  return audit;
}

/**
 * Audits the HTML actually served on the wire, not the hydrated DOM.
 *
 * This is the check that catches an RSC flight-payload leak. Props of a "use client"
 * component are serialised into `self.__next_f.push(...)` even when the component renders
 * null — so the demo annotations were invisible to `querySelectorAll` while being fully
 * readable in view-source on every page. A DOM-based test passed the whole time.
 */
async function auditRawHtml(route) {
  const res = await fetch(`${BASE}${route}`);
  const html = await res.text();

  // Distinctive phrases from the annotation prose of each client. If any appears in the
  // served HTML of a page without ?demo=true, the sales layer has shipped to the public.
  const demoFingerprints = [
    "tsd-note__body",
    "Markørene på siden viser hvorfor",
    "Det eneste tillitssignalet",
    "Den eneste symptomsiden",
    "Navn er det sterkeste tillitssignalet",
    "Størrelse som valg, ikke fritekst",
  ];
  for (const needle of demoFingerprints) {
    if (html.includes(needle)) {
      fail(route, "-", "demo-leak", `Demo layer content in served HTML: "${needle}"`);
    }
  }

  if (html.includes("TO_CONFIRM")) {
    fail(route, "-", "integrity", "TO_CONFIRM placeholder in served HTML");
  }

  // An enkeltpersonforetak's registered name is the owner's personal name. It is deliberately
  // absent from the Marine Max site and from its JSON-LD — including view-source, which is
  // why this is checked here and not in the DOM. See src/data/marine.ts.
  if (!route.startsWith("/proposal") && html.includes("Trond Erik Nielsen")) {
    fail(route, "-", "privacy", "Registered personal name in served HTML");
  }

  // Nothing on this host may be indexed while it hosts unapproved client concepts.
  if (!INDEXABLE && !/<meta name="robots"[^>]*noindex/i.test(html)) {
    fail(route, "-", "indexing", "No noindex directive in served HTML");
  }

  return html;
}

// --- interaction tests ------------------------------------------------------

/** Marine Max: the drawer, which unmounts rather than hides. */
async function testMarineNav(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/marine-max`, { waitUntil: "networkidle" });

  const burger = page.locator(".mm-burger");
  if ((await burger.count()) === 0) {
    fail("/marine-max", "390", "mobile-nav", "No burger button at 390px");
    return ctx.close();
  }
  await burger.click();

  const drawer = page.locator("#mm-drawer");
  if (!(await drawer.isVisible())) {
    fail("/marine-max", "390", "mobile-nav", "Drawer did not open");
    return ctx.close();
  }

  await page.keyboard.press("Escape");
  if (await drawer.isVisible()) {
    fail("/marine-max", "390", "mobile-nav", "Escape did not close the drawer");
  }

  await burger.click();
  await page.locator("#mm-drawer nav a", { hasText: "Reparasjon" }).first().click();
  await page.waitForURL("**/batreparasjon", { timeout: 8000 });
  if (await page.locator("#mm-drawer").isVisible()) {
    fail("/marine-max", "390", "mobile-nav", "Drawer stayed open after navigating");
  }
  await ctx.close();
}

/**
 * The phone path is the highest-value action on the marine site: the acute customer is
 * standing next to a dead engine. It has to work at 390 and be gone at 1440.
 */
async function testCallLinks(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/marine-max`, { waitUntil: "networkidle" });

  const bar = page.locator(".mm-handling");
  if (!(await bar.isVisible())) {
    fail("/marine-max", "390", "call-bar", "Mobile action bar not visible at 390px");
    return ctx.close();
  }

  const ring = bar.locator('a[href^="tel:"]');
  if ((await ring.count()) !== 1) {
    fail("/marine-max", "390", "call-bar", "Expected exactly one tel: link in action bar");
  }

  const box = await bar.boundingBox();
  if (box && box.height < 48) {
    fail("/marine-max", "390", "call-bar", `Action bar only ${Math.round(box.height)}px high`);
  }

  // The fixed bar must not cover content: the scope element reserves its height.
  const reserved = await page.evaluate(() => {
    const scope = document.querySelector(".mm");
    return scope ? getComputedStyle(scope).paddingBottom : "0px";
  });
  if (reserved === "0px") {
    fail("/marine-max", "390", "call-bar", "Scope reserves no space for the fixed action bar");
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  if (await page.locator(".mm-handling").isVisible()) {
    fail("/marine-max", "1440", "call-bar", "Action bar still visible at 1440px");
  }
  await ctx.close();
}

/** The structured service request — the commercial core of the marine concept. */
async function testLeadForm(browser) {
  const R = "/marine-max/bestill-service";
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + R, { waitUntil: "networkidle" });

  // Submitting empty must produce a focused error summary, not a silent failure.
  await page.locator('button[type="submit"]').click();
  const summary = page.locator('form [role="alert"]');
  if ((await summary.count()) === 0) {
    fail(R, "390", "lead-form", "No error summary on empty submit");
    return ctx.close();
  }

  const focused = await page.evaluate(
    () => document.activeElement?.getAttribute("role") === "alert",
  );
  if (!focused) fail(R, "390", "lead-form", "Error summary did not receive focus");

  const links = await summary.locator("a").count();
  if (links < 4) fail(R, "390", "lead-form", `Summary lists ${links} errors, expected >=4`);

  // Invalid phone must be rejected.
  await page.locator('input[value="reparasjon"]').check();
  await page.locator("#felt-beskrivelse").fill("Motoren starter ikke i det hele tatt i dag.");
  await page.locator('input[name="sted"][value="pa-henger"]').check();
  await page.locator("#felt-navn").fill("Ola Testesen");
  await page.locator("#felt-telefon").fill("123");
  await page.locator('button[type="submit"]').click();
  if ((await page.locator('form [role="alert"]').count()) === 0) {
    fail(R, "390", "lead-form", "Invalid phone number was accepted");
  }

  // Valid submission.
  await page.locator("#felt-telefon").fill("900 00 000");
  await page.locator("#felt-motormerke").fill("Mercury");
  await page.locator("#felt-motormodell").fill("60 hk");
  await page.locator("#felt-starter").selectOption("nei");
  await page.locator('button[type="submit"]').click();

  await page.waitForSelector("text=Takk — vi har fått den", { timeout: 5000 }).catch(() => {
    fail(R, "390", "lead-form", "Success state did not render");
  });

  const body = await page.locator("body").innerText();
  if (!/MM-\d{8}-/.test(body)) fail(R, "390", "lead-form", "No reference number in success state");
  if (!body.includes("Akutt")) {
    fail(R, "390", "lead-form", "Triage did not derive 'Akutt' for a non-starting engine");
  }

  const heading = await page.evaluate(() => document.activeElement?.tagName);
  if (heading !== "H2") {
    fail(R, "390", "lead-form", `Focus after submit went to ${heading}, expected H2`);
  }

  await ctx.close();
}

async function testMobileNav(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  for (const [route, burger, drawer, firstLink] of [
    ["/eik", ".eik-burger", "#eik-drawer", "/eik/tatovering"],
    ["/stabukk", ".sbk-burger", "#sbk-drawer", "/stabukk/arbeider"],
  ]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.click(burger);
    await page.waitForSelector(drawer, { state: "visible", timeout: 5000 });

    // Escape must close it and return focus to the trigger.
    await page.keyboard.press("Escape");
    await page.waitForSelector(drawer, { state: "detached", timeout: 5000 });
    const focused = await page.evaluate(() => document.activeElement?.className ?? "");
    if (!focused.includes("burger")) {
      fail(route, "390", "mobile-nav", `focus not restored to trigger (was "${focused}")`);
    }

    // Reopen and navigate.
    await page.click(burger);
    await page.waitForSelector(drawer, { state: "visible" });
    await page.click(`${drawer} a[href="${firstLink}"]`);
    await page.waitForURL(`**${firstLink}`, { timeout: 8000 });
    const stillOpen = await page.locator(drawer).count();
    if (stillOpen > 0) fail(route, "390", "mobile-nav", "drawer stayed open after navigation");
  }

  await ctx.close();
}

async function testGallery(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Eik grid + lightbox
  await page.goto(BASE + "/eik/portefolje", { waitUntil: "networkidle" });
  const allCount = await page.locator(".eik-grid > li").count();
  await page.click('.eik-filter:has-text("Fineline")');
  const filtered = await page.locator(".eik-grid > li").count();
  if (filtered >= allCount || filtered === 0) {
    fail("/eik/portefolje", "1440", "filter", `all=${allCount} filtered=${filtered}`);
  }
  await page.click('.eik-filter:has-text("Alle")');
  await page.click(".eik-tile");
  await page.waitForSelector(".eik-lightbox", { timeout: 5000 });
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".eik-lightbox", { state: "detached", timeout: 5000 });
  const restored = await page.evaluate(() => document.activeElement?.className ?? "");
  if (!restored.includes("eik-tile")) {
    fail("/eik/portefolje", "1440", "lightbox", `focus not restored (was "${restored}")`);
  }

  // Stabukk plate stack + viewer
  await page.goto(BASE + "/stabukk/arbeider", { waitUntil: "networkidle" });
  const plates = await page.locator(".sbk-stack > li").count();
  await page.click('.sbk-filter:has-text("Blackwork")');
  const platesFiltered = await page.locator(".sbk-stack > li").count();
  if (platesFiltered >= plates || platesFiltered === 0) {
    fail("/stabukk/arbeider", "1440", "filter", `all=${plates} filtered=${platesFiltered}`);
  }
  await page.click('.sbk-filter:has-text("Alle")');
  await page.click(".sbk-item__open");
  await page.waitForSelector(".sbk-viewer", { timeout: 5000 });
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".sbk-viewer", { state: "detached", timeout: 5000 });

  await ctx.close();
}

async function testEikBooking(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/eik/booking", { waitUntil: "networkidle" });

  // Step 0 must gate progression.
  const nextDisabled = await page.locator('button:has-text("Neste")').isDisabled();
  if (!nextDisabled) fail("/eik/booking", "390", "booking", "Neste enabled before a choice is made");

  // --- piercing branch: must be 3 steps and never show tattoo-only fields
  await page.click('input[value="piercing"]');
  await page.click('button:has-text("Neste")');
  await page.waitForSelector("#piercing");
  if (await page.locator("#idea").count()) {
    fail("/eik/booking", "390", "booking", "piercing branch shows tattoo idea field");
  }
  await page.selectOption("#piercing", "Helix");
  await page.locator('input[name="timing"][value="asap"]').check();
  await page.click('button:has-text("Neste")');
  await page.waitForSelector("#name");

  // Submit empty -> four errors
  await page.click('button[type="submit"]');
  const errs = await page.locator(".eik-error").count();
  if (errs < 4) fail("/eik/booking", "390", "booking", `expected 4 contact errors, got ${errs}`);

  // Invalid phone should be rejected
  await page.fill("#name", "Kari Nordmann");
  await page.fill("#email", "kari@example.no");
  await page.fill("#phone", "123");
  await page.check("#consent");
  await page.click('button[type="submit"]');
  if ((await page.locator(".eik-error").count()) === 0) {
    fail("/eik/booking", "390", "booking", "invalid phone accepted");
  }

  await page.fill("#phone", "40012345");
  await page.click('button[type="submit"]');
  await page.waitForSelector(".eik-success", { timeout: 5000 });
  const successText = await page.locator(".eik-success").innerText();
  if (!successText.includes("Kari")) {
    fail("/eik/booking", "390", "booking", "success state missing personalisation");
  }
  if (!successText.includes("Piercing")) {
    fail("/eik/booking", "390", "booking", "success summary missing enquiry type");
  }

  // Stored payload must be routable, not a blob of prose.
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("tycho.enquiries.eik") ?? "[]"),
  );
  if (!stored[0]?.triage?.route) {
    fail("/eik/booking", "390", "booking", "stored enquiry has no triage route");
  }
  if (stored[0]?.brief?.piercingType !== "Helix") {
    fail("/eik/booking", "390", "booking", "stored enquiry lost the piercing type");
  }

  // --- tattoo branch: 4 steps
  await page.goto(BASE + "/eik/booking", { waitUntil: "networkidle" });
  await page.click('input[value="tatovering"]');
  await page.click('button:has-text("Neste")');
  await page.waitForSelector("#idea");
  await page.click('button:has-text("Neste")'); // should block
  if ((await page.locator(".eik-error").count()) < 3) {
    fail("/eik/booking", "390", "booking", "tattoo step 1 did not block on empty fields");
  }
  await page.fill("#idea", "En liten botanisk gren på innsiden av underarmen, tynne linjer.");
  await page.selectOption("#placement", "Underarm");
  await page.locator('input[name="size"][value="s"]').check();
  await page.click('button:has-text("Neste")');
  await page.waitForSelector("#refs");
  await page.locator('input[name="timing"][value="1m"]').check();
  await page.click('button:has-text("Neste")');
  await page.waitForSelector("#name");
  await page.fill("#name", "Ola Nordmann");
  await page.fill("#email", "ola@example.no");
  await page.fill("#phone", "400 12 345");
  await page.check("#consent");
  await page.click('button[type="submit"]');
  await page.waitForSelector(".eik-success", { timeout: 5000 });

  const stored2 = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("tycho.enquiries.eik") ?? "[]"),
  );
  if (stored2[0]?.brief?.size !== "s" || stored2[0]?.brief?.placement !== "Underarm") {
    fail("/eik/booking", "390", "booking", "tattoo brief not persisted correctly");
  }
  if (stored2.length < 2) fail("/eik/booking", "390", "booking", "enquiry history not appended");

  await ctx.close();
}

async function testStabukkBooking(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/stabukk/booking", { waitUntil: "networkidle" });

  await page.click('button[type="submit"]');
  // Scoped to the form — Next.js ships its own role="alert" route announcer on <body>.
  const summary = page.locator('form [role="alert"]');
  await summary.waitFor({ timeout: 5000 });
  const links = await summary.locator("a").count();
  if (links < 6) fail("/stabukk/booking", "390", "booking", `error summary has only ${links} links`);

  // The summary must be focused so a screen reader announces it.
  const focusedRole = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  if (focusedRole !== "alert") {
    fail("/stabukk/booking", "390", "booking", `error summary not focused (role=${focusedRole})`);
  }

  await page.fill("#idea", "Ornamentalt arbeid over hele underarmen, svart, over flere økter.");
  await page.selectOption("#placement", "Underarm");
  await page.locator("#size-l").check();
  await page.locator("#timing-3m").check();
  await page.fill("#name", "Jonas Berg");
  await page.fill("#email", "jonas@example.no");
  await page.fill("#phone", "+47 400 12 345");
  await page.check("#consent");
  await page.click('button[type="submit"]');
  await page.waitForSelector(".sbk-success", { timeout: 5000 });

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("tycho.enquiries.stabukk") ?? "[]"),
  );
  if (stored[0]?.triage?.scope !== "multi-session") {
    fail("/stabukk/booking", "390", "booking", `triage scope = ${stored[0]?.triage?.scope}`);
  }
  if (stored[0]?.studio !== "stabukk") {
    fail("/stabukk/booking", "390", "booking", "enquiry written to wrong studio bucket");
  }

  await ctx.close();
}

async function testDemoLayer(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(BASE + "/eik?demo=true", { waitUntil: "networkidle" });
  await page.waitForSelector(".tsd-control__toggle", { timeout: 5000 });
  const pins = await page.locator(".tsd-note__pin").count();
  if (pins === 0) fail("/eik?demo=true", "1440", "demo", "no annotation pins rendered");

  await page.click(".tsd-note__pin");
  if ((await page.locator(".tsd-note__body").count()) === 0) {
    fail("/eik?demo=true", "1440", "demo", "annotation body did not open");
  }

  // Must persist across navigation within the session.
  await page.goto(BASE + "/eik/piercing", { waitUntil: "networkidle" });
  if ((await page.locator(".tsd-control__toggle").count()) === 0) {
    fail("/eik/piercing", "1440", "demo", "demo mode did not persist across navigation");
  }

  // And must switch off cleanly.
  await page.goto(BASE + "/eik?demo=false", { waitUntil: "networkidle" });
  if ((await page.locator(".tsd-control__toggle").count()) > 0) {
    fail("/eik?demo=false", "1440", "demo", "demo mode did not turn off");
  }

  // Every client shares one registry, so each one has to resolve its own ids — a note that
  // silently fails to load renders null and would otherwise look identical to "off".
  for (const [route, off] of [
    ["/marine-max", "/marine-max?demo=false"],
    ["/stabukk", "/stabukk?demo=false"],
  ]) {
    await page.goto(`${BASE}${route}?demo=true`, { waitUntil: "networkidle" });
    await page.waitForSelector(".tsd-note__pin", { timeout: 5000 }).catch(() => {
      fail(route, "1440", "demo", "no annotation pins rendered with demo on");
    });
    await page.goto(BASE + off, { waitUntil: "networkidle" });
  }

  await ctx.close();
}

async function testKeyboard(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  for (const route of ["/eik", "/stabukk"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => ({
      cls: document.activeElement?.className ?? "",
      text: document.activeElement?.textContent?.trim() ?? "",
    }));
    if (!first.cls.includes("skip-link")) {
      fail(route, "1440", "keyboard", `first tab stop is not the skip link (${first.text})`);
    }

    // Walk 25 stops and confirm every focused element has a visible outline.
    let missingOutline = 0;
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const ok = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return true;
        const s = getComputedStyle(el);
        return s.outlineStyle !== "none" || s.boxShadow !== "none";
      });
      if (!ok) missingOutline++;
    }
    if (missingOutline > 0) {
      fail(route, "1440", "keyboard", `${missingOutline}/25 focus stops without a visible ring`);
    }
  }

  await ctx.close();
}

async function testReducedMotion(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const route of ["/eik", "/stabukk"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const hidden = await page.evaluate(() => {
      const hid = (el) => {
        const s = getComputedStyle(el);
        return s.opacity === "0" || /inset\(\s*100%/.test(s.clipPath);
      };
      return [...document.querySelectorAll(".reveal")].filter(
        (el) => hid(el) || [...el.children].some(hid),
      ).length;
    });
    if (hidden > 0) {
      fail(route, "1440", "reduced-motion", `${hidden} reveal elements hidden with reduced motion`);
    }
  }
  await ctx.close();
}

async function testNoJs(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const route of ["/eik", "/stabukk"]) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const hidden = await page.evaluate(() => {
      const hid = (el) => {
        const s = getComputedStyle(el);
        return s.opacity === "0" || /inset\(\s*100%/.test(s.clipPath);
      };
      return [...document.querySelectorAll(".reveal")].filter(
        (el) => hid(el) || [...el.children].some(hid),
      ).length;
    });
    if (hidden > 0) fail(route, "no-js", "no-js", `${hidden} reveal elements invisible without JS`);
  }
  await ctx.close();
}

// --- run --------------------------------------------------------------------

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
await mkdir(SHOTS, { recursive: true });

const allInternalLinks = new Set();

for (const viewport of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    const audit = await auditPage(page, route, viewport);
    audit.links?.forEach((l) => allInternalLinks.add(l.split("?")[0].split("#")[0]));
  }
  await ctx.close();
  process.stdout.write(`· viewport ${viewport.name} done\n`);
}

// Every internal link must resolve.
const linkCtx = await browser.newContext();
const linkPage = await linkCtx.newPage();
for (const href of [...allInternalLinks].sort()) {
  if (!href || href === "") continue;
  const res = await linkPage.goto(BASE + href, { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) fail(href, "-", "broken-link", `status ${res?.status()}`);
}
await linkCtx.close();
process.stdout.write(`· ${allInternalLinks.size} internal links checked\n`);

for (const route of ROUTES) await auditRawHtml(route);
process.stdout.write(`· ${ROUTES.length} routes audited as served HTML\n`);

await testMarineNav(browser);
process.stdout.write("· marine nav done\n");
await testCallLinks(browser);
process.stdout.write("· call bar done\n");
await testLeadForm(browser);
process.stdout.write("· lead form done\n");
await testMobileNav(browser);
process.stdout.write("· mobile nav done\n");
await testGallery(browser);
process.stdout.write("· gallery done\n");
await testEikBooking(browser);
process.stdout.write("· eik booking done\n");
await testStabukkBooking(browser);
process.stdout.write("· stabukk booking done\n");
await testDemoLayer(browser);
process.stdout.write("· demo layer done\n");
await testKeyboard(browser);
process.stdout.write("· keyboard done\n");
await testReducedMotion(browser);
process.stdout.write("· reduced motion done\n");
await testNoJs(browser);
process.stdout.write("· no-js done\n");

await browser.close();

const report = { base: BASE, problems, notes, routes: ROUTES.length };
await writeFile("qa-report.json", JSON.stringify(report, null, 2));

console.log(`\n${"=".repeat(70)}`);
if (problems.length === 0) {
  console.log("PASS — no problems found");
} else {
  console.log(`FAIL — ${problems.length} problem(s)\n`);
  for (const p of problems) {
    console.log(`  [${p.kind}] ${p.route} @${p.viewport}\n      ${p.detail}\n`);
  }
}
if (notes.length) {
  console.log("Notes:");
  for (const n of notes) console.log(`  · ${n}`);
}
console.log("=".repeat(70));
process.exit(problems.length ? 1 : 0);
