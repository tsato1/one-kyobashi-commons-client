import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";
import { routing } from '@/i18n/routing';
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
        <Toaster closeButton />
      </body>
    </html>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const isJapanese = locale === "ja";

  return {
    title: "ONE Kyobashi Commons",
    description: isJapanese
      ? "ONE京橋コモンズ"
      : "ONE Kyobashi Commons",
    alternates: {
      canonical: isJapanese ? "/ja" : "/en",
      languages: {
        en: "/en",
        ja: "/ja",
      },
    },
    openGraph: {
      url: isJapanese ? "https://one-kyobashi-commons.com/ja" : "https://one-kyobashi-commons.com/en",
      // images: [
      //   {
      //     url: isJapanese ? "https://example.com/og-image-ja.jpg" : "https://example.com/og-image-en.jpg",
      //     width: 1200,
      //     height: 630,
      //     alt: isJapanese ? "ランディングページSEOのコツ" : "SEO Tips for Landing Pages",
      //   },
      // ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@one-kyobashi-commons",
      title: "ONE Kyobashi Commons",
      description: isJapanese
        ? "ONE京橋コモンズ"
        : "ONE Kyobashi Commons",
      // images: ["https://example.com/og-image.jpg"],
    },
    metadataBase: new URL("https://one-kyobashi-commons.com"),
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.png",
    }
    // verification: {
    //   google: "your-google-site-verification-code",
    // },
  };
}