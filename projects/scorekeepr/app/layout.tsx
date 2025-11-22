import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreKeepr - Simple Leaderboards for Teams & Gamers",
  description: "Create shareable leaderboards in seconds. Track ping pong scores, sales competitions, habit streaks, and more. Free to start.",
  keywords: ["leaderboard", "scoreboard", "score tracker", "ping pong score", "game tracker"],
  openGraph: {
    title: "ScoreKeepr - Simple Leaderboards for Teams & Gamers",
    description: "Create shareable leaderboards in seconds. Track ping pong scores, sales competitions, habit streaks, and more.",
    type: "website",
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
