import Icon from "./Icon";
import type { Service } from "@/data/calloway-roofing";

type ServicesProps = {
  services: Service[];
};

export function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="scroll-mt-24 bg-cr-paper py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="flex items-center justify-center gap-3 text-[13px] font-bold tracking-[0.16em] text-[var(--cr-accent-ink)]">
            <span className="h-0.5 w-[26px] bg-[var(--cr-accent-ink)]" aria-hidden="true" />
            WHAT WE DO
            <span className="h-0.5 w-[26px] bg-[var(--cr-accent-ink)]" aria-hidden="true" />
          </p>
          <h2
            className="mt-4 font-cr-display font-extrabold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: "clamp(30px, 3.6vw, 44px)" }}
          >
            Every job that keeps water out
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-cr-ink/65">
            One crew, one number to call, from a lifted shingle to a full tear-off. Everything
            below is quoted in writing before a single nail comes out.
          </p>
        </div>

        {/* Auto-fit from one column up to three. Capped at three rather than left to
            fill: six cards across four columns leaves a ragged row of two. */}
        <ul className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.title}>
              <a
                href="#contact"
                className="card-hairline group flex h-full flex-col rounded-2xl bg-white p-7 transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_36px_-22px_rgba(16,28,46,.45)] hover:[border-color:color-mix(in_oklab,var(--cr-accent)_35%,transparent)]"
              >
                <span className="accent-soft grid h-12 w-12 place-items-center rounded-xl text-[var(--cr-accent-ink)]">
                  <Icon name={service.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-cr-display text-[19px] font-bold tracking-[-0.02em]">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-cr-ink/65">{service.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--cr-accent-ink)]">
                  Learn more
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Services;
