// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "CareerPath-AI",
  description: "AI-powered career guidance based on your transcript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
