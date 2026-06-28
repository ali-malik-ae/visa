import type { Metadata } from "next";
import { inter, poppins, jetbrainsMono, montserrat } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visati — Dubai Visas. Simplified.",
  description:
    "Apply for UAE tourist, transit, and long-stay visas online. Fast processing, 99% approval rate, trusted by 1,000+ travellers worldwide.",
  metadataBase: new URL("https://visati.ae"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "Visati",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${montserrat.variable}`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
