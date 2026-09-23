import Link from "next/link";
import Logo from "./Logo";
import { hrefForLabel } from "./nav";

type FooterProps = {
  businessName: string;
  licenseNumber: string;
  footerLinks: string[];
};

export function Footer({ businessName, licenseNumber, footerLinks }: FooterProps) {
  return (
    <footer className="bg-cr-ink-deep">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <Logo businessName={businessName} size="sm" />

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-2 gap-y-1">
              {footerLinks.map((label) => (
                <li key={label}>
                  <Link
                    href={hrefForLabel(label)}
                    className="flex min-h-11 items-center rounded px-3 text-[15px] font-semibold text-white/65 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="pt-6 text-[14px] text-white/45">
          © {new Date().getFullYear()} {businessName} · License #{licenseNumber}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
