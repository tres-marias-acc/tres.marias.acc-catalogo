"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Categoria, Producto } from "@/lib/types";
import { CATEGORIAS_SUELTAS, GRUPOS_FILTRO, SUBCATEGORIAS } from "@/lib/types";
import { PASO_PRECIO } from "@/lib/catalog";
import PriceRange from "@/components/common/PriceRange";

interface Props {
  productos: Producto[];
  categoria: Categoria | null;
  grupo: string | null;
  subcategoria: string | null;
  soloDisponibles: boolean;
  precioMin: number;
  precioMax: number;
  precioPiso: number;
  precioTope: number;
  onCategoria: (c: Categoria | null) => void;
  onGrupo: (g: string | null) => void;
  onSubcategoria: (s: string | null) => void;
  onSoloDisponibles: (v: boolean) => void;
  onPrecio: (min: number, max: number) => void;
}

// Overrides de texto para categorias cuyo valor interno no coincide con
// como se quiere mostrar en el filtro. Vacio por ahora.
const ETIQUETAS: Record<string, string> = {};

export default function FilterBar({
  productos,
  categoria,
  grupo,
  subcategoria,
  soloDisponibles,
  precioMin,
  precioMax,
  precioPiso,
  precioTope,
  onCategoria,
  onGrupo,
  onSubcategoria,
  onSoloDisponibles,
  onPrecio,
}: Props) {
  const todosActivo = categoria === null && grupo === null;

  // Solo mostrar filtros (grupo, suelta o categoria dentro de un grupo) que
  // tengan al menos un producto cargado.
  const categoriasConProductos = new Set(productos.map((p) => p.categoria));
  const gruposVisibles = GRUPOS_FILTRO.filter((g) =>
    g.categorias.some((c) => categoriasConProductos.has(c))
  );
  const sueltasVisibles = CATEGORIAS_SUELTAS.filter((c) =>
    categoriasConProductos.has(c)
  );

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => {
            onCategoria(null);
            onGrupo(null);
          }}
          className={`rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
            todosActivo
              ? "bg-marias-400 text-marias-700 font-medium"
              : "bg-marias-50 text-neutral-600 hover:bg-marias-100"
          }`}
        >
          Todos
        </button>

        {gruposVisibles.map((g) => {
          const activo = grupo === g.label;
          return (
            <button
              key={g.label}
              onClick={() => {
                onGrupo(activo ? null : g.label);
                onCategoria(null);
              }}
              aria-expanded={activo}
              className={`rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
                activo
                  ? "bg-marias-400 text-marias-700 font-medium"
                  : "bg-marias-50 text-neutral-600 hover:bg-marias-100"
              }`}
            >
              {g.label}
            </button>
          );
        })}

        {sueltasVisibles.map((c) => {
          const activo = categoria === c;
          return (
            <button
              key={c}
              onClick={() => {
                onCategoria(activo ? null : c);
                onGrupo(null);
              }}
              className={`rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
                activo
                  ? "bg-marias-400 text-marias-700 font-medium"
                  : "bg-marias-50 text-neutral-600 hover:bg-marias-100"
              }`}
            >
              {ETIQUETAS[c] ?? c}
            </button>
          );
        })}
      </div>

      {gruposVisibles.map((g) => (
        <AnimatePresence key={g.label}>
          {grupo === g.label && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {g.categorias
                .filter((c) => categoriasConProductos.has(c))
                .map((c) => {
                const activo = categoria === c;
                return (
                  <button
                    key={c}
                    onClick={() => onCategoria(c)}
                    className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-colors ${
                      activo
                        ? "bg-marias-400 text-marias-700 font-medium"
                        : "bg-white text-neutral-500 ring-1 ring-marias-200 hover:bg-marias-50"
                    }`}
                  >
                    {ETIQUETAS[c] ?? c}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      <AnimatePresence>
        {categoria && SUBCATEGORIAS[categoria].length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {SUBCATEGORIAS[categoria].map((s) => {
              const activo = subcategoria === s;
              return (
                <button
                  key={s}
                  onClick={() => onSubcategoria(activo ? null : s)}
                  className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-colors ${
                    activo
                      ? "bg-marias-400 text-marias-700 font-medium"
                      : "bg-white text-neutral-500 ring-1 ring-marias-200 hover:bg-marias-50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <PriceRange
        min={precioMin}
        max={precioMax}
        piso={precioPiso}
        tope={precioTope}
        paso={PASO_PRECIO}
        onChange={onPrecio}
      />

      <button
        onClick={() => onSoloDisponibles(!soloDisponibles)}
        aria-pressed={soloDisponibles}
        className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
          soloDisponibles
            ? "bg-emerald-500 text-white"
            : "bg-marias-50 text-neutral-600 hover:bg-marias-100"
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            soloDisponibles ? "bg-white" : "bg-emerald-500"
          }`}
        />
        Solo disponibles
      </button>
    </div>
  );
}
