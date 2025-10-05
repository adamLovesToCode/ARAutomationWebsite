import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR Automation",
  description: "AR Automation Website",
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
