import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devi AI",
  description: "Powered by Tecbunny Solutions",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        {children}
      </body>
    </html>
  );
}
