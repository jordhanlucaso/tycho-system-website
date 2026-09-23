import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import type { Problem } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";
import Icon from "./Icon";

/**
 * Problem-led entry, directly under the hero.
 *
 * A homeowner arriving here has a symptom, not a service category in mind — they have a
 * stain on a ceiling. Sorting by problem rather than by service is the single biggest
 * conversion decision on the page: it lets someone self-select in one tap without knowing
 * whether what they have is a repair or a replacement.
 *
 * Each card describes a common roofing situation. None asserts that this business handles
 * insurance claims — see the brief and research §3.
 */
export default function ProblemSelector({ problems }: { problems: Problem[] }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="max-w-[40rem]">
        <Eyebrow>Start here</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">What can we help with?</h2>
        <p className="mt-3 text-hr-ink-soft">
          Pick whichever is closest to what you are seeing. You do not need to know what it
          is called.
          <DemoNote id="hr.03" />
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((p) => (
          <li key={p.title}>
            <Link
              href={p.href}
              className="group flex h-full flex-col border border-hr-hairline bg-white p-6 transition-colors hover:border-hr-brass"
            >
              <span className="flex h-11 w-11 items-center justify-center bg-hr-paper-alt text-hr-brass-ink transition-colors group-hover:bg-hr-brass group-hover:text-white">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <span className="mt-5 font-hr-display text-[1.06rem] font-bold text-hr-ink">
                {p.title}
              </span>
              <span className="mt-2 text-[0.92rem] leading-relaxed text-hr-ink-soft">{p.body}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-hr-brass-ink">
                Learn more
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
