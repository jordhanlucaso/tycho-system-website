import "../../classic-frisor/classic-frisor.css";
import { CF_SCOPE } from "../../classic-frisor/fonts";

/**
 * The proposal is written in the client's design system, so it needs the `.cf` scope and
 * its fonts — but not the site chrome. A sales document wearing the client's header reads
 * as a page of their website rather than a document about it, and the booking bar invites
 * a click that goes nowhere.
 */
export default function ClassicProposalLayout({
  children,
}: LayoutProps<"/proposal/classic-frisor">) {
  return (
    <div className={CF_SCOPE} style={{ paddingBottom: 0 }}>
      <a className="skip-link" href="#dok">
        Hopp til innhold
      </a>
      <main id="dok">{children}</main>
    </div>
  );
}
