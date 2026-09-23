import Image from "next/image";
import Icon from "./Icon";
import type { Testimonial as TestimonialData } from "@/data/calloway-roofing";

type TestimonialProps = {
  testimonial: TestimonialData;
  city: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonial({ testimonial, city }: TestimonialProps) {
  return (
    <section id="reviews" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <figure className="mx-auto max-w-[860px] px-5 text-center sm:px-6">
        <div className="flex justify-center gap-1 text-[var(--cr-accent-ink)]" role="img" aria-label="Rated 5 out of 5">
          {[0, 1, 2, 3, 4].map((index) => (
            <Icon key={index} name="star" className="h-5 w-5" />
          ))}
        </div>

        <blockquote
          className="mt-7 font-cr-display font-semibold leading-[1.4] tracking-[-0.02em]"
          style={{ fontSize: "clamp(21px, 2.4vw, 28px)" }}
        >
          <p>&ldquo;{testimonial.quote}&rdquo;</p>
        </blockquote>

        <figcaption className="mt-8 flex items-center justify-center gap-3.5">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt=""
              width={52}
              height={52}
              className="h-13 w-13 rounded-full object-cover"
            />
          ) : (
            <span
              className="grid h-13 w-13 place-items-center rounded-full bg-[var(--cr-accent-solid)] font-cr-display text-base font-extrabold text-[var(--cr-accent-solid-fg)]"
              aria-hidden="true"
            >
              {initials(testimonial.name)}
            </span>
          )}
          <span className="text-left">
            <span className="block font-cr-display text-[17px] font-bold tracking-[-0.01em]">
              {testimonial.name}
            </span>
            <span className="mt-0.5 block text-[14px] text-cr-ink/70">
              Homeowner · {testimonial.location} · {city}
            </span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

export default Testimonial;
