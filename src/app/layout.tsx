import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Snow&Go | Znajdź ekipę na wyjazd",
  description: "Platforma do szukania towarzyszy na wyjazdy sportowe.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.jpg?v=2",
    apple: "/icon-192x192.jpg?v=2",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Snow&Go",
  },
};

export const viewport: Viewport = {
  themeColor: "#0066cc", // Обновили цвет вьюпорта
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head> 
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      {/* bg-white вместо bg-[#f5f5f7] */}
      <body className={`${inter.className} bg-white min-h-screen text-gray-900 antialiased flex flex-col`}>
        {children}
      </body>
    </html>
  );
}