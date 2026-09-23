import Image from "next/image";
import type { SiteConfig } from "@/data/calloway-roofing";
import Icon from "./Icon";

type HeroProps = {
  hero: SiteConfig["hero"];
  phone: string;
  city: string;
};

export function Hero({ hero, phone, city }: HeroProps) {
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    // The navy is a real background, not decoration: the scrim is a sibling of the photo
    // rather than an ancestor, so with images off — or in any tool that resolves the
    // painted background by walking up the tree — the white type would otherwise be
    // sitting on the page's warm white.
    <section
      id="home"
      className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-cr-ink-deep"
    >
      <Image
        src={hero.image}
        alt=""
        fill
        priority
        // `priority` emits the preload; the hint has to be set explicitly for the
        // preload to carry fetchpriority=high, which is what actually moves LCP.
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Left-to-right navy scrim: type sits on near-solid colour, the photo opens up on the right. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, rgba(9,16,28,.94), rgba(9,16,28,.82) 42%, rgba(9,16,28,.2))",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24">
        <div className="max-w-[720px]">
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.16em] text-[var(--cr-accent-on-dark)]">
            <span className="h-0.5 w-[26px] bg-[var(--cr-accent-on-dark)]" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1
            className="mt-5 font-cr-display font-black leading-[1.04] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(38px, 5.4vw, 66px)" }}
          >
            {hero.headline}
          </h1>

          <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-white/75">
            {hero.subhead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="accent-button inline-flex min-h-12 items-center justify-center rounded-lg px-7 text-base font-bold transition-colors"
            >
              Get a Free Estimate
            </a>
            <a
              href={telHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 px-7 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <Icon name="phone" className="h-5 w-5" />
              Call {phone}
            </a>
          </div>

          <div className="mt-10 inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
            <span className="flex -space-x-2.5" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="grid h-8 w-8 place-items-center rounded-full bg-cr-ink text-white/70 ring-2 ring-[#0a1120]"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--cr-accent) ${18 + index * 14}%, #142338)`,
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2c-4 0-7.2 2.3-7.2 5.2V21h14.4v-1.8c0-2.9-3.2-5.2-7.2-5.2Z" />
                  </svg>
                </span>
              ))}
            </span>
            <p className="pr-1 text-sm text-white/85">
              <span className="font-cr-display font-extrabold text-white">{hero.trust.value}</span>{" "}
              {hero.trust.claim} in {city}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
