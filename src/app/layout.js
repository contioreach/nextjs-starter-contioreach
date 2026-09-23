import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NOINDEX, SITE_URL } from "@/utils/const";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Next.js Headless CMS Example | ContioReach",
    template: "%s",
  },
  description:
    "An open-source Next.js 16 App Router blog powered by a headless CMS — ISR, on-demand revalidation, category archives, JSON-LD and sitemaps included.",
  /* Default for every route, including ones that build their own metadata
     without buildMetadata() and the 404 page. */
  robots: NOINDEX
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-950 font-sans text-zinc-100 selection:bg-fuchsia-500/30">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
