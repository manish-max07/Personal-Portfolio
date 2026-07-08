import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/background/ParticleBackground";
import Navbar from "@/components/layout/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-loaded",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron-loaded",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manish Kumar | Full Stack Developer",
  description:
    "Portfolio of Manish Kumar — Full Stack Developer building scalable web apps with React, Node.js, and Python. Passionate about automation and performance.",
  keywords: [
    "full stack developer",
    "react developer",
    "node.js",
    "python",
    "web developer",
    "portfolio",
    "Manish Kumar",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-navy text-text-primary font-sans">
        <ParticleBackground />
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  );
}
