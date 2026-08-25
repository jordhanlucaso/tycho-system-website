import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./stabukk.css";
import { DemoProvider } from "@/components/demo/DemoLayer";
import { StabukkHeader } from "@/components/stabukk/StabukkChrome";
import { StabukkFooter } from "@/components/stabukk/StabukkPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { stabukkStudio } from "@/data/stabukk";
import { studioJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/site";

/**
 * One family, two extreme widths. The `wdth` axis is Stabukk's signature: expanded 125
 * shouting against normal 100 speaking, with a typewriter annotation layer underneath.
 */
const archivo = Archivo({
  variable: "--font-sbk",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--font-sbk-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tatovering i Tønsberg | Stabukk Tattoo Studio",
    template: "%s | Stabukk Tattoo Studio",
  },
  alternates: { canonical: absoluteUrl("/stabukk") },
};

export default function StabukkLayout({ children }: LayoutProps<"/stabukk">) {
  return (
    <div className={`sbk ${archivo.variable} ${mono.variable}`}>
      <JsonLd data={studioJsonLd(stabukkStudio)} />
      <DemoProvider>
        <a className="skip-link" href="#innhold">
          Hopp til innhold
        </a>
        <StabukkHeader />
        <main id="innhold">{children}</main>
        <StabukkFooter />
      </DemoProvider>
    </div>
  );
}
