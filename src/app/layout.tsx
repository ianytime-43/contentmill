import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContentMill — AI Content Repurposer | Turn 1 Post Into 20+",
  description: "Turn a single blog post into 20+ ready-to-publish posts for Twitter, LinkedIn, newsletters, and Instagram. Powered by AI. Try free.",
  keywords: ["content repurposer", "AI content tool", "social media automation", "content marketing", "repurpose blog posts", "AI writing tool"],
  openGraph: {
    title: "ContentMill — Turn 1 Post Into 20+",
    description: "AI-powered content repurposing. Paste once, get posts for every platform. Try it free.",
    type: "website",
    siteName: "ContentMill",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentMill — Turn 1 Post Into 20+",
    description: "AI-powered content repurposing. Paste once, get posts for every platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
