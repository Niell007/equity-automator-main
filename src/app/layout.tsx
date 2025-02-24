import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@/components/analytics'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { cn } from '@/lib/utils'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Equity Automator - Employment Equity Compliance Made Simple",
    template: "%s | Equity Automator"
  },
  description: "Streamline your Employment Equity reporting with automated tools, real-time compliance monitoring, and expert guidance.",
  keywords: "employment equity, compliance, automation, workforce management, EE reporting",
  authors: [{ name: "Equity Automator Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://equity-automator.com",
    title: "Equity Automator - Employment Equity Compliance Made Simple",
    description: "Streamline your Employment Equity reporting with automated tools, real-time compliance monitoring, and expert guidance.",
    siteName: "Equity Automator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Equity Automator - Employment Equity Compliance Made Simple",
    description: "Streamline your Employment Equity reporting with automated tools",
    creator: "@equityautomator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
};

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(
      "bg-white text-slate-900 antialiased",
      geistSans.variable,
      geistMono.variable,
    )}>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <a href="#main-content" 
               className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
          </div>
          <Toaster />
          <TailwindIndicator />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
