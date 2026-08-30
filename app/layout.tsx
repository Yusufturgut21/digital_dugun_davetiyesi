import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayşe & Mehmet | 14 Şubat 2026",
  description: "Ayşe ve Mehmet'in düğün kutlamasına sizi davet etmekten büyük mutluluk duyuyoruz.",
  openGraph: {
    title: "Ayşe & Mehmet | Düğün Davetiyesi",
    description: "14 Şubat 2026 · İstanbul",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#FAF6F0" />
      </head>
      <body className="bg-cream font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
