"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Categoria, Producto } from "@/lib/types";
import { GRUPOS_FILTRO } from "@/lib/types";
import { filtrarProductos, rangoPrecios } from "@/lib/catalog";
import FilterBar from "./FilterBar";
import ProductCard from "./ProductCard";

export default function CatalogSection({
  productos,
}: {
  productos: Producto[];
}) {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  // Grupo del filtro principal abierto (ej: "Fragancias"), o null si hay uno
  // suelto (Invierno) o ninguno seleccionado (Todos).
  const [grupo, setGrupo] = useState<string | null>(null);
  const [subcategoria, setSubcategoria] = useState<string | null>(null);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  // Los extremos de la barra salen del catalogo, que no cambia en runtime.
  const { piso, tope } = rangoPrecios(productos);
  const [precioMin, setPrecioMin] = useState(piso);
  const [precioMax, setPrecioMax] = useState(tope);

  // Sincronizar extremos si el catálogo cambia (ej: se agregan productos)
  useEffect(() => {
    setPrecioMin(piso);
    setPrecioMax(tope);
  }, [piso, tope]);

  // La Navbar emite este evento al clickear una categoria del menu
  useEffect(() => {
    function onSetFilter(e: Event) {
      const detail = (e as CustomEvent).detail as {
        categoria: Categoria | null;
      };
      setCategoria(detail.categoria);
      setSubcategoria(null);
      setGrupo(null);
    }
    window.addEventListener("tresmarias:set-filter", onSetFilter);
    return () => window.removeEventListener("tresmarias:set-filter", onSetFilter);
  }, []);

  // Sin categoria puntual pero con un grupo abierto (ej: tocaste "Fragancias"
  // sin elegir subtipo todavia): mostrar solo lo que pertenece a ese grupo.
  const categoriasDelGrupo = grupo
    ? GRUPOS_FILTRO.find((g) => g.label === grupo)?.categorias ?? null
    : null;
  const productosVisibles = categoriasDelGrupo
    ? productos.filter((p) => categoriasDelGrupo.includes(p.categoria))
    : productos;

  const visibles = filtrarProductos(
    productosVisibles,
    categoria,
    subcategoria,
    soloDisponibles,
    null,
    precioMin,
    precioMax
  );

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center font-serif text-4xl text-marias-700 md:text-5xl"
      >
        Catálogo
      </motion.h2>

      <FilterBar
        productos={productos}
        categoria={categoria}
        grupo={grupo}
        subcategoria={subcategoria}
        soloDisponibles={soloDisponibles}
        onCategoria={(c) => {
          setCategoria(c);
          setSubcategoria(null);
        }}
        onGrupo={setGrupo}
        onSubcategoria={setSubcategoria}
        onSoloDisponibles={setSoloDisponibles}
        precioMin={precioMin}
        precioMax={precioMax}
        precioPiso={piso}
        precioTope={tope}
        onPrecio={(min, max) => {
          setPrecioMin(min);
          setPrecioMax(max);
        }}
      />

      <motion.div
        layout
        className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {visibles.map((p, i) => (
            <ProductCard key={p.id} producto={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visibles.length === 0 && (
        <p className="mt-10 text-center text-neutral-400">
          No encontramos productos con estos filtros. Probá ajustar la búsqueda,
          el precio o la categoría.
        </p>
      )}
    </section>
  );
}
