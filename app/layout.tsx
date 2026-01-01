import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VirtualTwin | Il Tuo Clone AI che Vende 24/7",
  description: "Automatizza le tue vendite su WhatsApp, Instagram e Messenger con un clone AI che risponde, qualifica e converte. 100% italiano, setup in 5 minuti.",
  keywords: ["AI vendite", "automazione WhatsApp", "chatbot italiano", "clone digitale", "lead generation", "CRM AI"],
  authors: [{ name: "VirtualTwin" }],
  creator: "VirtualTwin",
  publisher: "VirtualTwin",
  openGraph: {
    title: "VirtualTwin | Il Tuo Clone AI che Vende 24/7",
    description: "Automatizza le tue vendite con un clone AI che risponde, qualifica e converte su WhatsApp, Instagram e Messenger.",
    url: "https://virtualtwin.ai",
    siteName: "VirtualTwin",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VirtualTwin | Il Tuo Clone AI che Vende 24/7",
    description: "Automatizza le tue vendite con un clone AI che risponde, qualifica e converte su WhatsApp, Instagram e Messenger.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${cormorant.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
