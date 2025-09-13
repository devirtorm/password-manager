import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/toggle-theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Password Manager",
    template: "%s | Password Manager",
  },
  description:
    "A secure and modern password manager built with Next.js and Supabase. Organize, secure, and manage all your passwords in one place.",
  keywords: [
    "password manager",
    "security",
    "encryption",
    "passwords",
    "nextjs",
    "supabase",
  ],
  authors: [{ name: "DevirtorM" }],
  creator: "DevirtorM",
  metadataBase: new URL(
    "https://password-manager-jfzvpag1f-irvings-projects-0af29d30.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://password-manager-jfzvpag1f-irvings-projects-0af29d30.vercel.app",
    title: "Password Manager",
    description:
      "A secure and modern password manager built with Next.js and Supabase",
    siteName: "Password Manager",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-neutral-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange 
        >
          {children}
          <Toaster
            toastOptions={{
              style: {
                background: "white",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              },
              className: "my-toast",
            }}
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
