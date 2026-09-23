import { DemoNote } from "@/components/demo/DemoLayer";
import { Eyebrow } from "./Primitives";

/**
 * Reviews — the component, with no reviews in it.
 *
 * The Montgomery listing carries a very small number of reviews. That is not nothing, but
 * it is not enough to reproduce here: we cannot confidently attribute individual written
 * reviews to this exact business, and a quote put in a stranger's mouth is the one thing on
 * a contractor site that can actually get the owner into trouble. So no names, no quotes,
 * no star count, and no rounded rating.
 *
 * Rather than hide the section, it states the position and turns it into the argument it
 * actually is — for a local contractor the review profile is what customers see before the
 * website exists, and it is the cheapest thing on the list to grow. Worth more to the owner
 * than three fabricated testimonials.
 */
export default function Reviews() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <Eyebrow>Reviews</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.3rem)]">
          This is where your reviews go
        </h2>
        <p className="mt-4 text-hr-ink-soft">
          Heritage has a local listing, but very few reviews on it. That matters more than
          it sounds: for a roofer, the profile is what a property owner sees before they
          ever reach a website, and for a business trading since 2010 it is the cheapest
          thing on this list to put right.
          <DemoNote id="hr.08" />
        </p>
        <p className="mt-3 text-hr-ink-soft">
          The component is built and waiting. As the profile collects reviews they appear
          here — real names, real words, nothing written by us.
        </p>
      </div>

      {/* An empty state drawn as an empty state: five outlined stars, no number beside
          them. A greyed-out "4.9" here would be a fabricated rating. */}
      <div className="border border-dashed border-hr-hairline bg-white p-8">
        <div className="flex gap-1.5 text-hr-brass" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <path d="m12 3.5 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.9l6.1-.8Z" />
            </svg>
          ))}
        </div>
        <p className="mt-5 font-hr-display text-[1.05rem] font-bold text-hr-ink">
          No reviews published yet
        </p>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-hr-ink-soft">
          Nothing is shown here until there is something real to show. Customer reviews are
          never written on a client&rsquo;s behalf.
        </p>
      </div>
    </div>
  );
}
