import type { Metadata } from "next";
import Nav from "@/components/homepage/Nav";
import Footer from "@/components/homepage/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
// import AnimatedBackground from "@/components/homepage/AnimatedBackground";

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
    <>
      <Nav />
      {/* <AnimatedBackground /> */}
      {children}
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
