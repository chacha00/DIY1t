import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DIY1T — See It. Build It. Make It Yourself.",
  description:
    "Upload a photo of almost anything and get an AI-generated DIY guide complete with materials, costs, instructions, and a printable shopping list.",
  verification: {
    google: "akXD1GZDf9ixsTfaOcoP92CwpEUO3KFW7JK7OVeQbIA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
