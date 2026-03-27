import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI-omformulering for Newton-rommet",
  description: "Lag kanaltilpassede SoMe-forslag fra én grunntekst."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="font-roboto">{children}</body>
    </html>
  );
}
