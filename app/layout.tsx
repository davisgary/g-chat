import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], style: ["normal", "italic"], variable: "--font-inter" });
const title = "G Chat";
const description = "Simple AI Chat.";
const ogimage = "/meta.png";
const siteName = "G Chat";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    title,
    images: [ogimage],
    siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}