import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { BreakingNews } from "@/components/layout/BreakingNews";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
    </>
  );
}
