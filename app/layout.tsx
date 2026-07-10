import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "pedidonuncachega",
  description:
    "Delivery fake de comida brasileira: dopamina grátis, figurinhas de motoboys e pedidos que nunca chegam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${bricolage.variable} ${inter.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
