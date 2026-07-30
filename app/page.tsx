import CatalogSection from "@/components/landing/CatalogSection";
import DestacadosSection from "@/components/landing/DestacadosSection";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import { obtenerProductos } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <main>
      <Navbar />
      <Hero />
      <DestacadosSection productos={productos} />
      <CatalogSection productos={productos} />
      <Footer />
    </main>
  );
}
