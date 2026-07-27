import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adamiani | Healthcare Coordination & Health Passport",
  description:
    "Adamiani helps patients organize medical cases and documents, explore treatment options, and build a private Health Passport. AI organizes. Doctors decide.",
  alternates: {
    canonical: "https://www.adamiani.ai/",
  },
  openGraph: {
    title: "Adamiani | Healthcare Coordination & Health Passport",
    description:
      "Organize medical cases, documents, treatment options, and your private Health Passport in one healthcare coordination platform.",
    url: "https://www.adamiani.ai/",
    siteName: "Adamiani",
    type: "website",
  },
};
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${space.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
