import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { BreakingNews } from "@/components/layout/BreakingNews";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "PTI News | Digital Information Hub",
  description: "Your trusted source for news, updates, and stories from the Petroleum Training Institute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} flex flex-col min-h-screen bg-slate-50 font-serif antialiased text-slate-900`}>
        <TopBar />
        <Navbar />
        <BreakingNews />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
