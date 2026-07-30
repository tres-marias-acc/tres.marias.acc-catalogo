"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { formatearPrecio } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/config";
import type { Producto } from "@/lib/types";
import ColorSwatches from "@/components/common/ColorSwatches";

const BADGE: Record<Producto["estado"], string> = {
  Disponible: "bg-emerald-100 text-emerald-700",
  "Sin stock": "bg-red-100 text-red-600",
};

export default function ProductCard({
  producto,
  index = 0,
  estatico = false,
}: {
  producto: Producto;
  index?: number;
  // true dentro del marquee: sin layout/exit animations (la pista ya se
  // mueve con CSS y las cards duplicadas no deben animar posicion).
  estatico?: boolean;
}) {
  return (
    <motion.article
      layout={!estatico}
      // En marquee (estatico) sin desplazamiento vertical: el contenedor
      // overflow-hidden recortaria la card mientras sube.
      initial={{ opacity: 0, y: estatico ? 0 : 24 }}
      whileInView={{
        opacity: producto.estado === "Sin stock" ? 0.75 : 1,
        y: 0,
      }}
      viewport={{ once: true, margin: "-40px" }}
      exit={estatico ? undefined : { opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: (index % 4) * 0.06,
      }}
      className={`group flex h-full flex-col rounded-2xl bg-white shadow-sm ring-1 transition-shadow ${
        producto.estado === "Sin stock"
          ? "ring-neutral-200"
          : "ring-marias-100/60 hover:shadow-xl hover:shadow-marias-200/40"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-marias-50">
        {producto.imagen_url && (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-500 ${
              estatico ? "" : "group-hover:scale-105"
            } ${producto.estado === "Sin stock" ? "grayscale-[75%]" : ""}`}
          />
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs ${BADGE[producto.estado]}`}
        >
          {producto.estado}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-serif text-base text-neutral-900 sm:text-lg">
          {producto.nombre}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500 sm:text-sm">
          {producto.descripcion_corta}
        </p>
        {producto.tonos && producto.tonos.length > 0 && (
          <ColorSwatches tonos={producto.tonos} />
        )}
        {producto.aroma && producto.aroma.length > 0 && (
          <p className="mt-1 line-clamp-1 text-[10px] font-medium uppercase tracking-wide text-marias-600">
            {producto.aroma.join(" · ")}
          </p>
        )}
        <p className="mt-auto pt-2 font-serif text-xl font-semibold text-marias-700 sm:text-2xl">
          {formatearPrecio(producto.precio)}
        </p>
        <a
          href={whatsappUrl(
            `Hola, tengo una consulta por *${producto.nombre} - ${formatearPrecio(producto.precio)}*`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-marias-300 px-3 py-1.5 text-xs font-medium text-marias-700 transition-transform hover:scale-[1.02] hover:bg-marias-200"
        >
          <svg viewBox="0 0 32 32" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.05 31.31l6.128-1.96A15.9 15.9 0 0 0 16.004 32C24.83 32 32 24.822 32 16S24.83 0 16.004 0zm9.31 22.594c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.604-1.204-4.702-1.948-7.73-6.726-7.966-7.036-.226-.31-1.9-2.53-1.9-4.826s1.166-3.414 1.634-3.892c.386-.394.928-.574 1.448-.574.168 0 .32.008.456.016.4.016.6.04.864.668.328.79 1.126 2.74 1.222 2.944.098.204.196.48.06.79-.128.318-.24.458-.444.694-.204.236-.398.416-.602.668-.186.22-.396.454-.162.86.234.4 1.042 1.718 2.232 2.776 1.536 1.368 2.782 1.804 3.232 1.99.336.14.736.106 1.006-.18.34-.368.762-.98 1.19-1.582.306-.432.692-.486 1.096-.334.412.144 2.604 1.228 3.052 1.452.448.226.744.336.852.522.108.19.108 1.086-.278 2.176z" />
          </svg>
          Consultar
        </a>
      </div>
    </motion.article>
  );
}
