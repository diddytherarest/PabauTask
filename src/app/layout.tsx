import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import LanguageSwitcher from "./components/LanguageSwitcher";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pabau Guitar Shop",
  description: "Online guitar shop built with Next.js and Apollo Client",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen grid grid-rows-[1fr_auto]">
            <main role="main">{children}</main>
            <footer
              role="contentinfo"
              className="border-t border-black/10 dark:border-white/10 p-4 flex justify-center"
            >
              <LanguageSwitcher />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
