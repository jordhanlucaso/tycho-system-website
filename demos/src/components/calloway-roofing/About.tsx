"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Icon from "./Icon";
import type { AboutTab } from "@/data/calloway-roofing";

type AboutProps = {
  about: { tabs: AboutTab[]; image: string };
  businessName: string;
};

export function About({ about, businessName }: AboutProps) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = about.tabs;

  /** Arrow keys move and select; Home/End jump. Standard tablist behaviour. */
  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = selected === last ? 0 : selected + 1;
    else if (event.key === "ArrowLeft") next = selected === 0 ? last : selected - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="about" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative h-[420px] overflow-hidden rounded-[14px]">
          <Image
            src={about.image}
            alt={`${businessName} crew reviewing plans on site`}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>

        <div>
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.16em] text-[var(--cr-accent-ink)]">
            <span className="h-0.5 w-[26px] bg-[var(--cr-accent-ink)]" aria-hidden="true" />
            WHO WE ARE
          </p>
          <h2
            className="mt-4 font-cr-display font-extrabold leading-[1.08] tracking-[-0.03em]"
            style={{ fontSize: "clamp(28px, 3.4vw, 42px)" }}
          >
            The people who quote the job are the people on the roof
          </h2>

          <div role="tablist" aria-label="About us" className="mt-8 flex gap-1 border-b border-cr-hairline">
            {tabs.map((tab, index) => {
              const isSelected = index === selected;
              return (
                <button
                  key={tab.label}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`about-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`about-panel-${index}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelected(index)}
                  onKeyDown={onKeyDown}
                  className={`relative -mb-px min-h-11 px-4 text-[15px] font-bold transition-colors ${
                    isSelected ? "text-cr-ink" : "text-cr-ink/70 hover:text-cr-ink"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--cr-accent)] transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {tabs.map((tab, index) => (
            <div
              key={tab.label}
              id={`about-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`about-tab-${index}`}
              hidden={index !== selected}
              tabIndex={0}
              className="pt-6"
            >
              <p className="text-[16px] leading-relaxed text-cr-ink/70">{tab.body}</p>
              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {tab.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[15px] font-semibold">
                    <span className="accent-soft mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[var(--cr-accent-ink)]">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
