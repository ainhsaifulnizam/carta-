import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import Chatbot from "@/components/Chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carta",
  description: "Turn NGO events into compounding civic networks."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Chatbot />
      </body>
    </html>
  );
}
