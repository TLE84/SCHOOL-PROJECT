import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

// The Footer (in the (site) layout) queries the database for categories.
// Since it lives in a layout every page inherits a DB dependency, which causes
// build-time static generation to fail when the DB isn't reachable from the
// build environment. Forcing dynamic rendering means pages are generated on
// each request instead.
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  // Absolute base for canonical and Open Graph URLs; per-page `openGraph.images`
  // are resolved against it. Set NEXT_PUBLIC_SITE_URL in deployment.
  metadataBase: new URL(siteUrl),
  title: {
    // Pages set a bare title (e.g. "News") and get the suffix for free.
    default: "PTI News | Digital Information Hub",
    template: "%s | PTI News",
  },
  description: "Your trusted source for news, updates, and stories from the Petroleum Training Institute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-slate-50 font-serif antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
