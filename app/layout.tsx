import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { config } from "@/lib/config";
import "./globals.css";

// TODO: reemplazar por RoxboroughCF (fuente de titulo de marca) cuando
// lleguen los archivos .woff2. Con next/font/local seria:
//   import localFont from "next/font/local";
//   const titulo = localFont({
//     src: "../public/fonts/RoxboroughCF-Regular.woff2",
//     variable: "--font-titulo",
//   });
// Mientras tanto se usa Cormorant Garamond como placeholder elegante.
const titulo = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-titulo",
});

const cuerpo = Nunito({
  subsets: ["latin"],
  variable: "--font-cuerpo",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: `${config.marca} | Accesorios Importados 💍`,
  description: config.tagline,
  openGraph: {
    title: config.marca,
    description: config.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${titulo.variable} ${cuerpo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
