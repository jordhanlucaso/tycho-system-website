import type { Stat } from "@/data/calloway-roofing";

type StatsProps = {
  stats: Stat[];
  yearsInBusiness: number;
};

/** The only substitution in the config: `{years}` in a stat value. */
function render(value: string, yearsInBusiness: number): string {
  return value.replace("{years}", String(yearsInBusiness));
}

export function Stats({ stats, yearsInBusiness }: StatsProps) {
  return (
    <section aria-label="By the numbers" className="bg-cr-ink py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-2 text-center sm:px-6 ${
                index % 2 === 1 ? "border-l border-white/12" : ""
              } ${index > 0 ? "lg:border-l lg:border-white/12" : "lg:border-l-0"}`}
            >
              <dt className="visually-hidden">{stat.label}</dt>
              <dd>
                <span
                  className="block font-cr-display font-black leading-none tracking-[-0.03em] text-[var(--cr-accent-on-dark)]"
                  style={{ fontSize: "clamp(34px, 4vw, 48px)" }}
                >
                  {render(stat.value, yearsInBusiness)}
                </span>
                <span className="mt-3 block text-[14px] font-semibold tracking-[0.04em] text-white/60">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Stats;
