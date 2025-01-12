import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { MainNav } from "@/components/navigation/main-nav"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.upsert({
    where: { id: userId },
    update: {},
    create: { 
      id: userId,
      email: userId + '@placeholder.com', // Will be updated on first sign-in
    },
  });

  return user;
}

export const metadata: Metadata = {
  title: "CompareModels.ai | Compare AI Language Models Side by Side",
  description: "Compare GPT-4, Claude, Llama, and other AI models side by side. Test responses, analyze features, and find the perfect AI model for your needs. Free tier available.",
  keywords: ["AI model comparison", "GPT-4 vs Claude", "compare language models", "AI model testing", "LLM comparison", "AI model pricing"],
  authors: [{ name: "CompareModels.ai" }],
  creator: "CompareModels.ai",
  publisher: "CompareModels.ai",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://comparemodels.ai",
    siteName: "CompareModels.ai",
    title: "Compare AI Models Side by Side | CompareModels.ai",
    description: "Test and compare AI language models like GPT-4, Claude, and Llama. Make data-driven decisions with side-by-side comparisons.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CompareModels.ai - Compare AI Models Side by Side"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare AI Models Side by Side | CompareModels.ai",
    description: "Test and compare AI language models like GPT-4, Claude, and Llama. Make data-driven decisions with side-by-side comparisons.",
    images: ["/twitter-image.png"],
    creator: "@comparemodels"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await syncUser();

  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
        >
          <MainNav />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
