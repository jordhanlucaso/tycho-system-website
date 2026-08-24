#!/usr/bin/env node
/**
 * Demo lifecycle CLI.
 *
 *   bun run demo status                    what is on the host, and what is overdue
 *   bun run demo new <slug>                scaffold a new engagement + concept
 *   bun run demo eject <concept> <dir>     extract a won concept to a standalone app
 *   bun run demo retire <engagement>       delete a declined or won engagement
 *
 * The registry in src/data/engagements.ts is the source of truth. `status` asserts it
 * against the filesystem in both directions, because the failure mode that matters is a
 * declined client's site still being served after everyone believes it was deleted.
 */

import { readdir, readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const { ENGAGEMENTS, CONCEPTS, RETENTION_DAYS, daysLeft, proposalPath, engagementOf } =
  await import(path.join(ROOT, "src/data/engagements.ts"));

const C = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

/** DD-MM-YYYY for display. ISO 8601 is what is stored. */
const no = (iso) => (iso ? iso.split("-").reverse().join("-") : "—");

const pascal = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
const camel = (s) => {
  const p = pascal(s);
  return p[0].toLowerCase() + p.slice(1);
};

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${question} `);
  rl.close();
  return answer.trim().toLowerCase() === "yes";
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function pagesUnder(dir, prefix) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "page.tsx") out.push(prefix);
    else if (entry.isDirectory() && !entry.name.startsWith("(") && !entry.name.startsWith("_")) {
      out.push(...(await pagesUnder(path.join(dir, entry.name), `${prefix}/${entry.name}`)));
    }
  }
  return out;
}

/* ── status ─────────────────────────────────────────────────────────────────────────── */

async function routeDirs() {
  const entries = await readdir(path.join(ROOT, "src/app"), { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("(") && !e.name.startsWith("_"))
    .map((e) => e.name)
    .filter((n) => n !== "proposal");
}

async function cmdStatus() {
  const now = new Date();
  const problems = [];

  console.log(`\n${C.bold("Engagements")} ${C.dim(`· retention ${RETENTION_DAYS} days`)}\n`);

  for (const e of ENGAGEMENTS) {
    const left = daysLeft(e, now);
    let clock = C.dim("—");

    if (e.status === "presented" && left !== null) {
      clock =
        left < 0
          ? C.red(`OVERDUE by ${-left} d`)
          : left <= 7
            ? C.yellow(`${left} d left`)
            : `${left} d left`;
      if (left < 0) {
        problems.push(`${e.slug}: past its retention deadline — retire it or update its status`);
      }
    }
    if (e.status === "won") {
      clock = C.green("won — eject, then retire");
      problems.push(`${e.slug}: won but still on the demo host`);
    }
    if (e.status === "declined") {
      clock = C.red("declined — retire");
      problems.push(`${e.slug}: declined but still on the demo host`);
    }

    console.log(
      `  ${C.bold(e.slug.padEnd(22))} ${e.status.padEnd(10)} ` +
        `${C.dim(`started ${no(e.started)}`)}  ${C.dim(`presented ${no(e.presented)}`)}  ${clock}`,
    );
    for (const c of e.concepts) {
      console.log(
        `    ${C.dim("·")} ${c.slug.padEnd(20)} ${C.dim(`.${c.scope}`)}` +
          `  ${C.dim(`${c.routes.length} routes`)}`,
      );
    }
  }

  // --- drift: registry vs filesystem, in both directions ------------------------------
  console.log(`\n${C.bold("Drift check")}\n`);

  const onDisk = new Set(await routeDirs());
  const inRegistry = new Set(CONCEPTS.map((c) => c.slug));

  for (const slug of onDisk) {
    if (!inRegistry.has(slug)) {
      problems.push(`src/app/${slug}/ is served but is in no engagement — orphaned concept`);
    }
  }

  for (const c of CONCEPTS) {
    if (!onDisk.has(c.slug)) {
      problems.push(`${c.slug} is registered but src/app/${c.slug}/ is missing`);
    }
    for (const rel of [c.componentDir, c.dataModule, c.stylesheet]) {
      if (!existsSync(path.join(ROOT, rel))) problems.push(`${c.slug}: missing ${rel}`);
    }

    // every registered route must be a real page
    for (const r of c.routes) {
      const page = path.join(ROOT, "src/app", r.path.replace(/^\//, ""), "page.tsx");
      if (!existsSync(page)) problems.push(`${c.slug}: route ${r.path} has no page.tsx`);
    }

    // ...and every page under the concept must be a registered route
    const conceptRoot = path.join(ROOT, "src/app", c.slug);
    if (existsSync(conceptRoot)) {
      const known = new Set(c.routes.map((r) => r.path));
      for (const found of await pagesUnder(conceptRoot, `/${c.slug}`)) {
        if (!known.has(found)) problems.push(`${c.slug}: ${found} exists but is not registered`);
      }
    }
  }

  for (const e of ENGAGEMENTS) {
    if (!existsSync(path.join(ROOT, "engagements", e.slug))) {
      problems.push(`${e.slug}: no engagements/${e.slug}/ docs folder`);
    }
    if (!existsSync(path.join(ROOT, "src/app/proposal", e.slug, "page.tsx"))) {
      problems.push(`${e.slug}: no proposal at ${proposalPath(e)}`);
    }
  }

  if (problems.length === 0) {
    console.log(`  ${C.green("clean")} — registry and filesystem agree\n`);
  } else {
    for (const p of problems) console.log(`  ${C.red("·")} ${p}`);
    console.log();
  }

  process.exit(problems.length ? 1 : 0);
}

/* ── new ────────────────────────────────────────────────────────────────────────────── */

function cssTemplate(name, scope) {
  return `/* ═══════════════════════════════════════════════════════════════════════════════════
   ${name.toUpperCase()} — designsystem

   Scoped under \`.${scope}\`. Every rule in this file MUST sit inside that scope: several
   brand systems share one app, and an unscoped \`:root\` block or bare element selector here
   will overwrite the others in whatever order the bundler happens to emit them.

   Reset, \`.skip-link\`, \`.visually-hidden\` and the Tycho demo layer live in app/globals.css
   and are shared by every client. Do not redefine them here.
   ═══════════════════════════════════════════════════════════════════════════════════ */

.${scope} {
  /* tokens */
}
`;
}

function layoutTemplate(slug, scope) {
  return `import type { Metadata } from "next";
import "./${slug}.css";
import { DemoProvider } from "@/components/demo/DemoLayer";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "TODO", template: "%s" },
  description: "TODO",
  alternates: { canonical: absoluteUrl("/${slug}") },
};

/** Client layout, not a root layout. \`.${scope}\` is the scope ${slug}.css hangs off. */
export default function ${pascal(slug)}Layout({ children }: LayoutProps<"/${slug}">) {
  return (
    <div className="${scope}">
      <DemoProvider>
        <a className="skip-link" href="#innhold">
          Hopp til innhold
        </a>
        <main id="innhold">{children}</main>
      </DemoProvider>
    </div>
  );
}
`;
}

function pageTemplate(slug, name) {
  return `import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "TODO — 50-60 tegn, tjeneste + sted først",
  description: "TODO — 140-160 tegn.",
  path: "/${slug}",
  siteName: "${name}",
});

export default function Forsiden() {
  return <h1>${name}</h1>;
}
`;
}

function dataTemplate(slug, name) {
  return `/**
 * ${name} — business data.
 *
 * Every value here is either verified against a primary source (state which, and the date
 * it was retrieved) or marked TO_CONFIRM. A directory listing is not a primary source.
 */

import { TO_CONFIRM } from "./types";

export const ${camel(slug)} = {
  // TODO
  email: TO_CONFIRM,
};
`;
}

async function cmdNew(slug, opts) {
  if (!slug || !/^[a-z][a-z0-9-]*$/.test(slug)) {
    console.error(`Slug must be lowercase kebab-case. Got "${slug ?? ""}".`);
    process.exit(1);
  }
  if (CONCEPTS.some((c) => c.slug === slug) || ENGAGEMENTS.some((e) => e.slug === slug)) {
    console.error(`"${slug}" already exists in the registry.`);
    process.exit(1);
  }
  if (existsSync(path.join(ROOT, "src/app", slug))) {
    console.error(`src/app/${slug}/ already exists.`);
    process.exit(1);
  }

  const scope = opts.scope ?? slug.split("-").map((w) => w[0]).join("").slice(0, 3);
  const name = opts.name ?? slug;
  const appDir = path.join(ROOT, "src/app", slug);

  await mkdir(appDir, { recursive: true });
  await mkdir(path.join(ROOT, "src/components", slug), { recursive: true });
  await mkdir(path.join(ROOT, "src/app/proposal", slug), { recursive: true });
  for (const sub of ["research", "design", "content", "sales"]) {
    await mkdir(path.join(ROOT, "engagements", slug, sub), { recursive: true });
  }

  await writeFile(path.join(appDir, `${slug}.css`), cssTemplate(name, scope));
  await writeFile(path.join(appDir, "layout.tsx"), layoutTemplate(slug, scope));
  await writeFile(path.join(appDir, "page.tsx"), pageTemplate(slug, name));
  await writeFile(path.join(ROOT, "src/data", `${slug}.ts`), dataTemplate(slug, name));

  const today = new Date().toISOString().slice(0, 10);

  console.log(`
${C.green("Scaffolded")} ${C.bold(slug)}  ${C.dim(`scope .${scope}`)}

  src/app/${slug}/             layout.tsx  page.tsx  ${slug}.css
  src/app/proposal/${slug}/    ${C.dim("(empty — add page.tsx)")}
  src/components/${slug}/      ${C.dim("(empty)")}
  src/data/${slug}.ts
  engagements/${slug}/         research/ design/ content/ sales/

${C.bold("Now add it to src/data/engagements.ts:")}

  {
    slug: "${slug}",
    label: "${name}",
    place: "TODO",
    status: "draft",
    started: "${today}",
    proposalNote: "TODO",
    concepts: [
      {
        slug: "${slug}",
        scope: "${scope}",
        name: "${name}",
        blurb: "TODO",
        componentDir: "src/components/${slug}",
        dataModule: "src/data/${slug}.ts",
        stylesheet: "src/app/${slug}/${slug}.css",
        routes: [{ path: "/${slug}", priority: 1.0 }],
      },
    ],
  },

Then ${C.cyan("bun run demo status")} to confirm registry and filesystem agree.
`);
}

/* ── retire ─────────────────────────────────────────────────────────────────────────── */

async function cmdRetire(slug, opts) {
  const e = ENGAGEMENTS.find((x) => x.slug === slug);
  if (!e) {
    console.error(
      `No engagement "${slug ?? ""}". Known: ${ENGAGEMENTS.map((x) => x.slug).join(", ")}`,
    );
    process.exit(1);
  }

  const targets = [
    `src/app/proposal/${e.slug}`,
    `engagements/${e.slug}`,
    ...e.concepts.flatMap((c) => [`src/app/${c.slug}`, c.componentDir, c.dataModule]),
  ].filter((t) => existsSync(path.join(ROOT, t)));

  console.log(`\n${C.bold(`Retiring ${e.slug}`)} ${C.dim(`(${e.status})`)}\n`);
  console.log("  Deletes:");
  for (const t of targets) console.log(`    ${C.red("−")} ${t}`);

  const noteKeys = e.concepts.map((c) => `"${c.scope}.*"`).join(", ");
  console.log(`
  Leaves for you, because each needs a judgement call:
    · the registry block in src/data/engagements.ts
    · this engagement's annotations in src/components/demo/notes.ts (${noteKeys})
    · any nav entries in src/data/nav.ts
`);

  if (e.status === "draft" || e.status === "presented") {
    console.log(
      `  ${C.yellow("Note:")} status is "${e.status}". Retiring a live engagement is unusual —\n` +
        `  set it to "won" or "declined" first if the client has actually decided.\n`,
    );
  }

  if (!opts.yes && !(await confirm(`  Type ${C.bold("yes")} to delete ${targets.length} paths:`))) {
    console.log("\n  Aborted. Nothing deleted.\n");
    process.exit(0);
  }

  for (const t of targets) await rm(path.join(ROOT, t), { recursive: true, force: true });

  console.log(`\n  ${C.green("Deleted")} ${targets.length} paths.`);
  console.log(
    `  ${C.cyan("Next:")} remove the registry block, then ${C.cyan("bun run demo status")}.\n`,
  );
}

/* ── eject ──────────────────────────────────────────────────────────────────────────── */

async function cmdEject(conceptSlug, target) {
  const concept = CONCEPTS.find((c) => c.slug === conceptSlug);
  if (!concept) {
    console.error(
      `No concept "${conceptSlug ?? ""}". Known: ${CONCEPTS.map((c) => c.slug).join(", ")}`,
    );
    process.exit(1);
  }
  if (!target) {
    console.error("Usage: bun run demo eject <concept> <target-dir>");
    process.exit(1);
  }

  const out = path.resolve(target);
  if (existsSync(out)) {
    console.error(`${out} already exists. Pick a path that does not.`);
    process.exit(1);
  }

  const engagement = engagementOf(conceptSlug);
  console.log(`\n${C.bold(`Ejecting ${concept.name}`)} → ${C.dim(out)}\n`);

  // 1. the concept's routes, with the /<slug> prefix stripped by flattening into src/app
  await mkdir(path.join(out, "src/app"), { recursive: true });
  await cp(path.join(ROOT, "src/app", concept.slug), path.join(out, "src/app"), {
    recursive: true,
  });

  // 2. shared machinery it depends on
  for (const rel of [
    "src/app/globals.css",
    "src/lib",
    "src/components/shared",
    "src/data/types.ts",
  ]) {
    await cp(path.join(ROOT, rel), path.join(out, rel), { recursive: true });
  }
  await cp(path.join(ROOT, concept.componentDir), path.join(out, "src/components", concept.slug), {
    recursive: true,
  });
  await cp(path.join(ROOT, concept.dataModule), path.join(out, concept.dataModule));

  // 3. config
  for (const rel of ["tsconfig.json", "eslint.config.mjs", "postcss.config.mjs", "next.config.ts"]) {
    await cp(path.join(ROOT, rel), path.join(out, rel));
  }

  // 4. the research and design travel with the client — they paid for the thinking
  if (engagement && existsSync(path.join(ROOT, "engagements", engagement.slug))) {
    await cp(path.join(ROOT, "engagements", engagement.slug), path.join(out, "docs"), {
      recursive: true,
    });
  }

  // --- mechanical rewrites -------------------------------------------------------------
  const edited = [];
  for (const file of await walk(path.join(out, "src"))) {
    if (!/\.(tsx?|css)$/.test(file)) continue;
    const before = await readFile(file, "utf8");
    let after = before;

    // route prefix: "/marine-max/x" -> "/x", "/marine-max" -> "/"
    after = after.replaceAll(`"/${concept.slug}/`, '"/');
    after = after.replaceAll(`"/${concept.slug}"`, '"/"');
    after = after.replaceAll(`\`/${concept.slug}/`, "`/");

    // the demo layer has no place on a live client site
    after = after.replace(/^[ \t]*<DemoNote id="[^"]*" \/>\n/gm, "");
    after = after.replace(/^import \{ DemoNote \} from "@\/components\/demo\/DemoLayer";\n/gm, "");
    after = after.replace(
      /^import \{ DemoProvider \} from "@\/components\/demo\/DemoLayer";\n/gm,
      "",
    );
    after = after.replace(/^[ \t]*<\/?DemoProvider>\n/gm, "");

    // unscope the stylesheet
    if (file.endsWith(".css")) {
      after = after.replace(new RegExp(`^\\.${concept.scope} \\{`, "gm"), ":root {");
      after = after.replaceAll(`.${concept.scope} `, "");
    }

    if (after !== before) {
      await writeFile(file, after);
      edited.push(path.relative(out, file));
    }
  }

  const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8"));
  await writeFile(
    path.join(out, "package.json"),
    JSON.stringify(
      {
        name: concept.slug,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "eslint",
          typecheck: "tsc --noEmit",
        },
        dependencies: pkg.dependencies,
        devDependencies: Object.fromEntries(
          Object.entries(pkg.devDependencies).filter(([k]) => k !== "playwright-core"),
        ),
        packageManager: pkg.packageManager,
      },
      null,
      2,
    ) + "\n",
  );

  await writeFile(
    path.join(out, ".env.example"),
    `# The client's real origin. Every canonical, OG URL and JSON-LD @id derives from it.
NEXT_PUBLIC_SITE_ORIGIN=https://example.no

# This is the client's live site, so it SHOULD be indexed.
NEXT_PUBLIC_INDEXABLE=true
`,
  );

  await writeFile(
    path.join(out, ".gitignore"),
    "node_modules\n.next\nnext-env.d.ts\n*.tsbuildinfo\n.env\n",
  );

  console.log(`  ${C.green("✓")} routes       src/app/${concept.slug}/* → src/app/*`);
  console.log(`  ${C.green("✓")} components   ${concept.componentDir}`);
  console.log(`  ${C.green("✓")} data         ${concept.dataModule}`);
  console.log(
    `  ${C.green("✓")} styles       ${path.basename(concept.stylesheet)}` +
      ` (unscoped from .${concept.scope})`,
  );
  console.log(`  ${C.green("✓")} docs         engagements/${engagement?.slug ?? "—"}/ → docs/`);
  console.log(`  ${C.red("✗")} demo layer   removed`);
  console.log(`  ${C.red("✗")} proposal     not copied`);
  console.log(`  ${C.dim(`${edited.length} files rewritten`)}\n`);

  console.log(`${C.bold("This is a starting point, not a finished handover.")} Check by hand:\n`);
  console.log(`  1. ${C.cyan(`cd ${out} && bun install && bun run build`)}`);
  console.log("  2. Any remaining reference to the demo layer, the hub, or a sibling client");
  console.log(`  3. The stylesheet: base element rules were scoped under .${concept.scope} and`);
  console.log("     are global again — check html/body/heading rules against globals.css");
  console.log("  4. lib/jsonld.ts still exports every client's emitters — delete the others");
  console.log("  5. Set NEXT_PUBLIC_INDEXABLE=true and a real origin, then re-check robots.txt");
  console.log(
    `  6. Back here: set the engagement to "won", then ${C.cyan("bun run demo retire")}\n`,
  );
}

/* ── dispatch ───────────────────────────────────────────────────────────────────────── */

/** Flags that take a value, so `--name "Prøveklient AS"` works as well as `--name=X`. */
const VALUE_FLAGS = new Set(["name", "scope"]);

const [cmd, ...rest] = process.argv.slice(2);
const flags = {};
const args = [];

for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (!a.startsWith("--")) {
    args.push(a);
    continue;
  }
  const [key, inline] = a.slice(2).split("=");
  if (inline !== undefined) {
    flags[key] = inline;
  } else if (VALUE_FLAGS.has(key) && rest[i + 1] && !rest[i + 1].startsWith("--")) {
    flags[key] = rest[++i];
  } else {
    flags[key] = true;
  }
}

switch (cmd) {
  case "status":
    await cmdStatus();
    break;
  case "new":
    await cmdNew(args[0], flags);
    break;
  case "retire":
    await cmdRetire(args[0], flags);
    break;
  case "eject":
    await cmdEject(args[0], args[1]);
    break;
  default:
    console.log(`
${C.bold("Demo lifecycle")}

  bun run demo status                     what is live, what is overdue, registry drift
  bun run demo new <slug> --name "X" --scope xx
  bun run demo eject <concept> <dir>      extract a won concept to a standalone app
  bun run demo retire <engagement> [--yes]

Retention is ${RETENTION_DAYS} days from the date in \`presented\`.
`);
    process.exit(cmd ? 1 : 0);
}
