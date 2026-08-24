import "../../marine-max/marine-max.css";
import { MM_SCOPE } from "../../marine-max/fonts";

/**
 * The Marine Max proposal is written in the client's own design system, so it needs the
 * `.mm` scope and its fonts — but not the site chrome. A sales document with the client's
 * header, footer and call bar around it reads as a page of their website rather than as a
 * document about it, and the call bar in particular invites a click that goes nowhere.
 *
 * This is also why the proposal does not live at /marine-max/proposal: everything under
 * that segment inherits the site layout by design.
 */
export default function MarineProposalLayout({
  children,
}: LayoutProps<"/proposal/marine-max">) {
  return (
    <div className={MM_SCOPE}>
      <a className="skip-link" href="#dok">
        Hopp til innhold
      </a>
      <main id="dok">{children}</main>
    </div>
  );
}
