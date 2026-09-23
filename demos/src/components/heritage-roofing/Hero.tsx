import { DemoNote } from "@/components/demo/DemoLayer";
import { Button } from "./Primitives";
import RoofArt from "./RoofArt";

/**
 * The first screen, and the only one that gets five seconds.
 *
 * Everything asserted here is in the public record: the market, the founding year, the two
 * capabilities, the phone number. There is no counter of completed roofs, no manufacturer
 * badge and no BBB accreditation claim — the rating is A+ but the business is not
 * accredited, and the difference matters.
 *
 * "since 2010" rather than a computed "16 years": a hardcoded age is wrong every January,
 * and deriving it from the current year makes the copy change under the client's feet.
 *
 * The backdrop is drawn, not photographed. There is no photography of this company's work,
 * and a stock roof behind this headline would read as a claim about a house they worked on.
 * The geometry of the trade does the same job and asserts nothing — see RoofArt.tsx.
 */
export default function Hero({
  phone,
  phoneHref,
  city,
  since,
  trust,
}: {
  phone: string;
  phoneHref: string;
  city: string;
  since: number;
  trust: string[];
}) {
  return (
    <section className="hr-dark relative isolate flex min-h-[600px] items-center overflow-hidden bg-hr-slate-deep lg:min-h-[660px]">
      {/* Drawn, not photographed — see RoofArt.tsx for why. */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <RoofArt />
      </div>
      {/* The scrim is a sibling of the photo, not an ancestor: with images off, the type
          is still white on near-solid slate rather than white on the page's warm paper. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(102deg, rgba(23,29,30,.95), rgba(23,29,30,.88) 44%, rgba(23,29,30,.42))",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="max-w-[46rem]">
          <p className="hr-eyebrow">
            Serving {city} &amp; the River Region since {since}
            <DemoNote id="hr.01" />
          </p>

          <h1 className="mt-5 font-hr-display text-[clamp(2.4rem,6.4vw,4.1rem)] font-extrabold text-white">
            Roofing built to protect what matters.
          </h1>

          <p className="mt-5 max-w-[34rem] text-[1.06rem] leading-relaxed text-hr-muted">
            Residential and commercial roofing across Montgomery and the surrounding River
            Region — helping property owners protect what they have, with the work explained
            in plain terms before it begins.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/heritage-roofing/estimate">Request an Estimate</Button>
            <Button href={`tel:${phoneHref}`} variant="outline-dark">
              <span className="hr-tel">Call {phone}</span>
            </Button>
          </div>

          {/* Verified trade categories and a place. No counts, no credentials. */}
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
            <DemoNote id="hr.02" />
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[0.82rem] text-white/75">
                <span className="h-1.5 w-1.5 flex-none bg-hr-brass" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
