import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StepStyle | Ayakkabı Mağazası",
  description: "En trend ayakkabı modelleri, uygun fiyatlar ve hızlı kargo ile StepStyle'da.",
  openGraph: {
    title: "StepStyle | Ayakkabı Mağazası",
    description: "Kadın, erkek ve çocuk ayakkabılarında en geniş koleksiyon",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0f0f0f" />
      </head>
      <body className="bg-neutral-950 font-sans antialiased text-white">
        {children}
      </body>
    </html>
  );
}
