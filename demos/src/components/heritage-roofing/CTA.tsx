import { DemoNote } from "@/components/demo/DemoLayer";
import { Button } from "./Primitives";

/**
 * The mid-page conversion band. Two actions, no third.
 *
 * Aimed squarely at the visitor who does not know what they need — which, for roofing, is
 * most of them. "Not sure" is the most-selected option on forms like this one, so the
 * headline says so out loud rather than making someone self-diagnose before they are
 * allowed to get in touch.
 */
export default function CTA({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  return (
    <div className="mx-auto max-w-[44rem] text-center">
      <h2 className="text-[clamp(1.8rem,4.2vw,2.7rem)] text-white">
        Not sure what your roof needs?
      </h2>
      <p className="mx-auto mt-4 max-w-[34rem] text-hr-muted-green">
        Tell us what&rsquo;s happening and start with a conversation about your roof.
        <DemoNote id="hr.12" />
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/heritage-roofing/estimate">Request an Estimate</Button>
        <Button href={`tel:${phoneHref}`} variant="outline-dark">
          <span className="hr-tel">Call {phone}</span>
        </Button>
      </div>
    </div>
  );
}
