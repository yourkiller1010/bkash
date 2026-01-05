import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova Exchange",
  description: "Token-based client portal for exchange orders + 24/7 support",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-grid text-white">
        {children}
      </body>
    </html>
  );
}
