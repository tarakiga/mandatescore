import type { Metadata } from "next";
import { Asap } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const asap = Asap({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "MandateScore",
  description:
    "Mandate Score is a worldwide scorecard that tracks how elected officials in any country are keeping their campaign promises, turning complex politics into clear, evidence-based ratings."
};

type RootLayoutProps = {
  readonly children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={asap.className}>{children}</body>
    </html>
  );
}
