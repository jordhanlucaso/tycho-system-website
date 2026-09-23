import { DemoNote } from "@/components/demo/DemoLayer";
import { Eyebrow } from "./Primitives";

/**
 * Local relevance, written for a reader first and a crawler second.
 *
 * The search terms this page needs to hold — roofing Montgomery AL, roof repair
 * Montgomery, commercial roofing Montgomery, gutters Montgomery — appear where they would
 * appear anyway in a paragraph about roofs in Central Alabama. No stuffing, no city-name
 * list, and no invented climate statistics: the weather is described in terms any property
 * owner here would recognise rather than with a rainfall figure we have not checked.
 */
export default function LocalSection({ serviceArea }: { serviceArea: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <Eyebrow>Montgomery, Alabama</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] text-white">
          Roofing services in Montgomery, Alabama
        </h2>
        <p className="mt-4 leading-relaxed text-hr-muted-green">
          Roofs across the River Region take a particular kind of beating. Long humid
          summers, heavy rain that arrives faster than a gutter can clear, and thunderstorms
          that put wind and hail through the same roof year after year. Damage rarely
          announces itself — more often it shows up as a stain on a ceiling months after the
          weather that caused it.
          <DemoNote id="hr.09" />
        </p>
        <p className="mt-4 leading-relaxed text-hr-muted-green">
          It is also why roofing, gutter and siding work around Montgomery tend to arrive
          together. Water the roof sheds correctly still has to get away from the building,
          and a gutter overflowing against a foundation causes a slower and more expensive
          problem than the missing shingle that started it.
        </p>
      </div>

      <div className="border-t-2 border-hr-brass pt-6 lg:border-l lg:border-t-0 lg:border-hr-hairline-dark lg:pl-10 lg:pt-0">
        <h3 className="font-hr-display text-[1.05rem] font-bold text-white">Service area</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-hr-muted-green">{serviceArea}</p>
        <p className="mt-4 text-[0.88rem] leading-relaxed text-hr-muted-green/80">
          The exact towns covered are set from one list in the site configuration — once
          Heritage confirms its range, each one becomes a named place on this page.
          <DemoNote id="hr.10" />
        </p>
      </div>
    </div>
  );
}
