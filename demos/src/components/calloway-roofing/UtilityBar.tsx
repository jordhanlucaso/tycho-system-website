import Icon from "./Icon";

type UtilityBarProps = {
  phone: string;
  email: string;
};

/** Thin dark strip above the header. Hidden below `sm`, where the sheet carries it instead. */
export function UtilityBar({ phone, email }: UtilityBarProps) {
  const items = [
    { label: phone, href: `tel:${phone.replace(/[^0-9+]/g, "")}`, icon: "phone" as const },
    { label: email, href: `mailto:${email}`, icon: "mail" as const },
    { label: "24/7 Emergency Service", href: null, icon: "clock" as const },
  ];

  return (
    <div className="hidden bg-cr-ink-deep sm:block">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 px-6 text-[13px] text-white/70">
        {items.map((item) => {
          const body = (
            <>
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cr-accent)]"
                aria-hidden="true"
              />
              <Icon name={item.icon} className="h-4 w-4 text-white/45" />
              <span>{item.label}</span>
            </>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              className="flex min-h-11 items-center gap-2 rounded transition-colors hover:text-white"
            >
              {body}
            </a>
          ) : (
            <span key={item.label} className="flex min-h-11 items-center gap-2">
              {body}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default UtilityBar;
