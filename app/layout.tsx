import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory + Local Search",
  description: "Merchant inventory management and consumer search."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </body>
    </html>
  );
}
