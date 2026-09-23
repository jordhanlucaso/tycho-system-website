import { DemoNote } from "@/components/demo/DemoLayer";
import type { Pillar } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";
import Icon from "./Icon";

/**
 * Differentiation without manufactured differentiators.
 *
 * We do not know this company's record, so none of these four is a claim about it. Each
 * describes how the job goes for the homeowner — which is both the only honest material
 * available and, for someone with water coming through a ceiling, the more persuasive
 * material anyway. Every line here stays true on day one, before the owner tells us
 * anything at all.
 */
export default function TrustSection({ pillars }: { pillars: Pillar[] }) {
  return (
    <>
      <div className="max-w-[40rem]">
        <Eyebrow>How it should go</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] text-white">
          Roofing shouldn&rsquo;t be complicated.
        </h2>
        <p className="mt-3 text-hr-muted-green">
          Most of what makes a roofing job stressful is not the roof. It is not knowing what
          is happening, what it will cost, or when anyone is turning up.
          <DemoNote id="hr.05" />
        </p>
      </div>

      <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
        {pillars.map((p) => (
          <li key={p.title} className="flex gap-5">
            <span className="mt-0.5 flex-none text-hr-brass-glow">
              <Icon name={p.icon} className="h-7 w-7" />
            </span>
            <span>
              <span className="block font-hr-display text-[1.12rem] font-bold text-white">
                {p.title}
              </span>
              <span className="mt-2 block text-[0.94rem] leading-relaxed text-hr-muted-green">
                {p.body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
