import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import LanguageSwitcher from "./components/LanguageSwitcher"; // ← fixed path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pabau Guitar Shop",
  description: "Online guitar shop built with Next.js and Apollo Client",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen grid grid-rows-[1fr_auto]">
            <main>{children}</main>

            <footer className="border-t border-black/10 dark:border-white/10 p-4 flex justify-center">
              <LanguageSwitcher />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
