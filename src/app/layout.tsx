import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Snow&Go | Znajdź ekipę na wyjazd",
  description: "Platforma do szukania towarzyszy na wyjazdy sportowe.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Snow&Go",
  },
};

export const viewport: Viewport = {
  themeColor: "#3a3a5c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f5f5f7] min-h-screen text-gray-900 antialiased flex flex-col`}>
        {children}
      </body>
    </html>
  );
}