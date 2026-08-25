import type { Metadata } from "next";
import "./classic-frisor.css";
import { CF_SCOPE } from "./fonts";
import { DemoProvider } from "@/components/demo/DemoLayer";
import { Footer, Handlingslinje } from "@/components/classic-frisor/Primitives";
import { Header } from "@/components/classic-frisor/Header";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Frisør på Teie, Nøtterøy — Classic Frisør",
    template: "%s",
  },
  description:
    "Frisørsalong på Smidsrødveien, Teie. Klipp, farge og styling. Se priser og bestill time.",
  alternates: { canonical: absoluteUrl("/classic-frisor") },
};

/**
 * Client layout, not a root layout. `.cf` is the scope every rule in classic-frisor.css
 * hangs off. Fonts load here rather than in the root layout so a visitor to another
 * client's concept never downloads Fraunces.
 */
export default function ClassicFrisorLayout({ children }: LayoutProps<"/classic-frisor">) {
  return (
    <div className={CF_SCOPE}>
      <DemoProvider>
        <a className="skip-link" href="#innhold">
          Hopp til innhold
        </a>
        <Header />
        <main id="innhold">{children}</main>
        <Footer />
        <Handlingslinje />
      </DemoProvider>
    </div>
  );
}
