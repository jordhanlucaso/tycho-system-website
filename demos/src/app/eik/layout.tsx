import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./eik.css";
import { DemoProvider } from "@/components/demo/DemoLayer";
import { EikHeader } from "@/components/eik/EikChrome";
import { EikFooter } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { eikStudio } from "@/data/eik";
import { studioJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/site";

const display = Instrument_Serif({
  variable: "--font-eik-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const text = Inter({
  variable: "--font-eik-text",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-eik-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tatovering og piercing i Tønsberg | Eik Tattoo & Piercing",
    template: "%s | Eik Tattoo & Piercing",
  },
  alternates: { canonical: absoluteUrl("/eik") },
};

export default function EikLayout({ children }: LayoutProps<"/eik">) {
  return (
    <div className={`eik ${display.variable} ${text.variable} ${mono.variable}`}>
      <JsonLd data={studioJsonLd(eikStudio)} />
      <DemoProvider>
        <a className="skip-link" href="#innhold">
          Hopp til innhold
        </a>
        <EikHeader />
        <main id="innhold">{children}</main>
        <EikFooter />
      </DemoProvider>
    </div>
  );
}
