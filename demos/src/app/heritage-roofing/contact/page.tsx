import { pageMetadata } from "@/lib/seo";
import { DemoNote } from "@/components/demo/DemoLayer";
import EstimateForm from "@/components/heritage-roofing/EstimateForm";
import { Eyebrow, Section } from "@/components/heritage-roofing/Primitives";
import { estimateTopics, siteConfig } from "@/data/heritage-roofing";

export const metadata = pageMetadata({
  title: "Contact | Heritage Roofing, Montgomery AL",
  description:
    "Contact Heritage Roofing in Montgomery, Alabama. Call (334) 354-8650 or send an estimate request for roofing, gutters or siding.",
  path: "/heritage-roofing/contact",
  siteName: "Heritage Roofing",
});

/**
 * Contact.
 *
 * One channel — the phone number. No email is published because none is verified, and an
 * invented address is both a fabrication and a dead end for whoever writes to it. No street
 * address either: public records disagree about it, so `siteConfig.address` is null and the
 * page shows a city and a region. The gaps are stated rather than filled.
 */
export default function ContactPage() {

  return (
    <Section tone="paper" className="pt-28 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,2.8rem)]">Get in touch</h1>
          <p className="mt-4 text-hr-ink-soft">
            The fastest way to reach {siteConfig.shortName} is by phone.
            <DemoNote id="hr.16" />
          </p>

          <dl className="mt-9 space-y-6">
            <div className="border-t border-hr-hairline pt-5">
              <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-hr-ink-soft">
                Phone
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="hr-tel font-hr-display text-[1.65rem] font-extrabold text-hr-ink"
                >
                  {siteConfig.phone}
                </a>
              </dd>
            </div>

            <div className="border-t border-hr-hairline pt-5">
              <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-hr-ink-soft">
                Service area
              </dt>
              <dd className="mt-2 text-hr-ink">{siteConfig.serviceArea}</dd>
            </div>

            <div className="border-t border-hr-hairline pt-5">
              <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-hr-ink-soft">
                Business
              </dt>
              <dd className="mt-2 text-hr-ink">{siteConfig.extendedName}</dd>
              <dd className="mt-1 text-[0.9rem] text-hr-ink-soft">
                {siteConfig.license.authority} · License #{siteConfig.license.number}
              </dd>
            </div>
          </dl>

          <p className="mt-8 max-w-[30rem] text-[0.88rem] leading-relaxed text-hr-ink-soft">
            Opening hours, an email address and a street address are not published here.
            Public records give conflicting addresses for the business, and hours change —
            each appears the day Heritage confirms it.
            <DemoNote id="hr.17" />
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9">
          <h2 className="font-hr-display text-[1.35rem] font-bold text-hr-ink">
            Send an estimate request
          </h2>
          <p className="mt-2 text-[0.94rem] text-hr-ink-soft">
            Or call, if it is urgent — a leak usually is.
          </p>
          <div className="mt-7">
            <EstimateForm topics={estimateTopics} />
          </div>
        </div>
      </div>
    </Section>
  );
}
