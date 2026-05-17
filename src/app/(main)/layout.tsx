import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "@/components/homepage/Nav";
import Footer from "@/components/homepage/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

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
        <body>
          <Nav />
          {children}
          <Footer />
          <FloatingWhatsApp />
        </body>
      </html>
    </ClerkProvider>
  );
}
