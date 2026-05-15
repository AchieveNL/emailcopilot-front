import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "@/components/homepage/Nav";
import Footer from "@/components/homepage/Footer";

export const metadata: Metadata = {
  title: "Emailcopilot.io",
  description: "AI-powered email outreach automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <Nav />
        <body>{children}</body>
        <Footer />
      </html>
    </ClerkProvider>
  );
}
