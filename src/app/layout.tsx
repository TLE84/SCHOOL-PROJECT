import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { BreakingNews } from "@/components/layout/BreakingNews";
import { Footer } from "@/components/layout/Footer";
import { siteUrl } from "@/lib/site";

// The Footer queries the database for categories. Since it lives in the root
// layout every page inherits a DB dependency, which causes build-time static
// generation to fail when the DB isn't reachable from the build environment.
// Forcing dynamic rendering means pages are generated on each request instead.
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
        {/* Off-screen until focused, so keyboard users can jump the nav. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-green-700 focus:px-5 focus:py-3 focus:font-sans focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <TopBar />
        <Navbar />
        <BreakingNews />
        <main id="main-content" tabIndex={-1} className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
