import type { Metadata } from "next";
import "./marine-max.css";
import { MM_SCOPE } from "./fonts";
import { DemoProvider } from "@/components/demo/DemoLayer";
import { Footer, Handlingslinje } from "@/components/marine/Primitives";
import { Header } from "@/components/marine/Header";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Båtservice på Nøtterøy — Marine Max",
    template: "%s",
  },
  description:
    "Båtservice, motorservice og reparasjon på Nøtterøy. Registrert og i drift siden 2005.",
  alternates: { canonical: absoluteUrl("/marine-max") },
};

/**
 * Client layout, not a root layout. `.mm` is the scope every rule in marine-max.css hangs
 * off — see the header of that file. The fonts load here rather than in the root layout so
 * a visitor to /eik never downloads Barlow.
 */
export default function MarineMaxLayout({ children }: LayoutProps<"/marine-max">) {
  return (
    <div className={MM_SCOPE}>
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
