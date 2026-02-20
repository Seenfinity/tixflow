import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TixFlow - AI Event Assistant",
  description: "AI-powered event assistant that helps users discover, purchase, and coordinate event tickets",
  icons: {
    icon: "/logo.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
