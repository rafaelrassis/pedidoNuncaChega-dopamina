import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import RegistrarServiceWorker from "@/components/RegistrarServiceWorker";
import { URL_SITE } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const TITULO_PADRAO = "PedidoNuncaChega — peça sem culpa, a comida nunca chega";
const DESCRICAO_PADRAO =
  "Delivery fake de comida brasileira: peça sem culpa, acompanhe um motoboy que nunca chega, colecione figurinhas e ganhe dopamina grátis. Sem cadastro, sem cobrança.";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: TITULO_PADRAO,
    template: "%s · PedidoNuncaChega",
  },
  description: DESCRICAO_PADRAO,
  openGraph: {
    title: TITULO_PADRAO,
    description: DESCRICAO_PADRAO,
    url: URL_SITE,
    siteName: "PedidoNuncaChega",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_PADRAO,
    description: DESCRICAO_PADRAO,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#E2574C",
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
        <RegistrarServiceWorker />
      </body>
    </html>
  );
}
