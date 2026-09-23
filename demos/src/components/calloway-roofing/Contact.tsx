import EstimateForm from "./EstimateForm";
import Icon from "./Icon";
import type { GlyphName } from "./Icon";

type ContactProps = {
  businessName: string;
  city: string;
  phone: string;
  email: string;
  licenseNumber: string;
  /**
   * `h2` inside the front page, where the hero owns the h1. The contact route is built
   * from this section alone, so there it has to be the h1 — a page with no h1 leaves a
   * screen reader with nothing to jump to.
   */
  as?: "h1" | "h2";
};

export function Contact({
  businessName,
  city,
  phone,
  email,
  licenseNumber,
  as: Heading = "h2",
}: ContactProps) {
  const rows: { icon: GlyphName; label: string; value: string; href?: string; note?: string }[] = [
    {
      icon: "phone",
      label: "Call us",
      value: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, "")}`,
      note: "24/7 for emergencies",
    },
    {
      icon: "mail",
      label: "Email us",
      value: email,
      href: `mailto:${email}`,
      note: "Replies within one business day",
    },
    {
      icon: "pin",
      label: "Service area",
      value: `${city} and 40 miles around it`,
      note: `Licensed, bonded and insured · License #${licenseNumber}`,
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 bg-cr-ink py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.16em] text-[var(--cr-accent-on-dark)]">
            <span className="h-0.5 w-[26px] bg-[var(--cr-accent-on-dark)]" aria-hidden="true" />
            GET IN TOUCH
          </p>
          <Heading
            className="mt-4 font-cr-display font-extrabold leading-[1.06] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(30px, 3.8vw, 46px)" }}
          >
            Get a Free Roof Estimate Today
          </Heading>
          <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-white/70">
            Tell us the address and what you are seeing. We will come out, photograph the roof, and
            put a fixed price in writing — usually within one business day.
          </p>

          <ul className="mt-10 space-y-6">
            {rows.map((row) => (
              <li key={row.label} className="flex items-start gap-4">
                <span className="accent-soft-strong grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[var(--cr-accent-on-dark)]">
                  <Icon name={row.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold tracking-[0.1em] text-white/60">
                    {row.label.toUpperCase()}
                  </p>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="mt-1 inline-flex min-h-11 items-center break-words font-cr-display text-[19px] font-bold tracking-[-0.01em] text-white hover:text-[var(--cr-accent-on-dark)]"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-cr-display text-[19px] font-bold tracking-[-0.01em] text-white">
                      {row.value}
                    </p>
                  )}
                  {row.note ? <p className="mt-1 text-[14px] text-white/55">{row.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div id="contact-form" className="scroll-mt-24">
          <EstimateForm businessName={businessName} />
        </div>
      </div>
    </section>
  );
}

export default Contact;
