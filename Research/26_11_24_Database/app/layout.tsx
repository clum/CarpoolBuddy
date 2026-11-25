import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarpoolBuddy | Plan a carpool",
  description: "Enter user, vehicle, and trip details for a local CarpoolBuddy demo.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
