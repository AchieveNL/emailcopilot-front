import type { Metadata } from "next";
import "@/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "sonner"

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
          {children}
             <Toaster theme="light" position="top-right" closeButton={true} richColors={true} />
        </body>
      </html>
    </ClerkProvider>
  );
}
