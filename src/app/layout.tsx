import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/app/globals.css";
import { SonnerProvider } from "@/providers/sonner-provider";

const geistSans = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "OrderWA",
  description: "Generator pesan order WhatsApp yang rapi dan siap kirim.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="id"
      className={geistSans.variable}
      data-scroll-behavior="smooth"
    >
      <body>
        <div className="app-shell">{children}</div>
        <SonnerProvider />
      </body>
    </html>
  );
}
