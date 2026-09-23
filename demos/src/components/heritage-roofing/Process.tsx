import { DemoNote } from "@/components/demo/DemoLayer";
import type { Step } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";

/**
 * Four steps, numbered because they genuinely are a sequence.
 *
 * Deliberately free of scheduling promises — no "same-day", no "24-hour estimate", no
 * "we'll be there within the hour". Those are the standard lines on a roofing site and
 * every one of them is a commitment this business has not made.
 */
export default function Process({ steps }: { steps: Step[] }) {
  return (
    <>
      <div className="max-w-[40rem]">
        <Eyebrow>The process</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">A simple way to get started</h2>
        <p className="mt-3 text-hr-ink-soft">
          Four steps, and the first one is a conversation rather than a commitment.
          <DemoNote id="hr.06" />
        </p>
      </div>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="border-t-2 border-hr-brass pt-5">
            <span className="font-hr-display text-[0.8rem] font-bold tracking-[0.14em] text-hr-ink-soft">
              {s.n}
            </span>
            <h3 className="mt-2 font-hr-display text-[1.1rem] font-bold text-hr-ink">{s.title}</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-hr-ink-soft">{s.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
