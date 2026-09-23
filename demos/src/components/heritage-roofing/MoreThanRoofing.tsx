import { DemoNote } from "@/components/demo/DemoLayer";
import { additionalServices } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";

/**
 * The construction side of Heritage Roofing and Construction.
 *
 * It is in the public record, so leaving it off would be its own kind of inaccuracy — but
 * roofing is the lead-generation objective and this band must not compete with it. Hence
 * the deliberate restraint: no icons, no cards with borders, no accent colour, no call to
 * action of its own. Three text columns under a rule, set smaller than the services above.
 *
 * If it ever starts pulling attention from the roofing grid, it has failed at its job.
 */
export default function MoreThanRoofing({ extendedName }: { extendedName: string }) {
  return (
    <div className="border-t border-hr-hairline pt-10">
      <div className="max-w-[44rem]">
        <Eyebrow>Also</Eyebrow>
        <h2 className="mt-3 font-hr-display text-[1.35rem] font-bold text-hr-ink">
          More than roofing
        </h2>
        <p className="mt-2 text-[0.94rem] leading-relaxed text-hr-ink-soft">
          {extendedName} also provides selected construction and home-improvement services
          across the River Region.
          <DemoNote id="hr.18" />
        </p>
      </div>

      <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-3">
        {additionalServices.map((s) => (
          <li key={s.title}>
            <h3 className="font-hr-display text-[1rem] font-bold text-hr-ink">{s.title}</h3>
            <p className="mt-1.5 text-[0.9rem] leading-relaxed text-hr-ink-soft">{s.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
