import Link from "next/link";

/**
 * Persistent call / estimate bar on phones.
 *
 * Roofing leads arrive from a phone, often from someone standing in their own driveway
 * looking at the roof. The two things they might do are one tap away from every scroll
 * position on every route. Hidden from 1024px, where the header already carries both.
 *
 * The layout adds matching bottom padding to <main> so this can never cover the footer.
 */
export default function MobileActionBar({
  phone,
  phoneHref,
}: {
  phone: string;
  phoneHref: string;
}) {
  return (
    <div className="hr-actionbar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-hr-hairline-dark bg-hr-slate lg:hidden">
      <a
        href={`tel:${phoneHref}`}
        className="hr-tel flex min-h-[58px] items-center justify-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
        Call Now
        <span className="sr-only">{phone}</span>
      </a>
      <Link
        href="/heritage-roofing/estimate"
        className="flex min-h-[58px] items-center justify-center bg-hr-brass-solid text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white"
      >
        Get Estimate
      </Link>
    </div>
  );
}
