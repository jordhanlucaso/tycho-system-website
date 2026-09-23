import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import type { Service } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";
import Icon from "./Icon";

/**
 * Services.
 *
 * `service.confirmed` is never rendered. All six services here are in the public record
 * for Heritage Roofing and Construction, so all six are confirmed — what stays unverified
 * is the detail inside each one, which is why no material, brand, warranty or turnaround
 * is claimed. The flag remains because one edit has to be able to remove a service the
 * owner says they do not offer.
 */
export default function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <>
      <div className="max-w-[40rem]">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">
          Roofing and exteriors across the River Region
        </h2>
        <p className="mt-3 text-hr-ink-soft">
          Homes and commercial property alike: whether it is one failed detail letting
          water in or a roof that has run out of life, the first step is the same — someone
          looks at it and tells you plainly what it needs.
          <DemoNote id="hr.04" />
        </p>
      </div>

      <ul className="mt-10 grid gap-px overflow-hidden border border-hr-hairline bg-hr-hairline sm:grid-cols-2">
        {services.map((s) => (
          <li key={s.slug} className="bg-white">
            <Link
              href={`/heritage-roofing/${s.slug}`}
              className="group flex h-full gap-5 p-7 transition-colors hover:bg-hr-paper"
            >
              <span className="mt-0.5 flex-none text-hr-brass-ink">
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <span>
                <span className="block font-hr-display text-[1.18rem] font-bold text-hr-ink">
                  {s.title}
                </span>
                <span className="mt-2 block text-[0.94rem] leading-relaxed text-hr-ink-soft">
                  {s.body}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
