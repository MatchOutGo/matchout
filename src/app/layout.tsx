import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "MatchOut | Znajdź ekipę na wyjazd",
  description: "Platforma do szukania towarzyszy na wyjazdy sportowe.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MatchOut",
  },
};

export const viewport: Viewport = {
  themeColor: "#0071e3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${inter.className} bg-[#f5f5f7] min-h-screen text-gray-900 antialiased flex flex-col`}>
        {children}
      </body>
    </html>
  );
}