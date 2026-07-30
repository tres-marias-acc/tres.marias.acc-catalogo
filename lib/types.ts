export type Categoria =
  | "Aritos"
  | "Pulseras"
  | "Collares"
  | "Anillos"
  | "Spray Textil"
  | "Difusor"
  | "Cremas"
  | "Vela Aromática"
  | "Invierno";
export type Estado = "Disponible" | "Sin stock";

export interface Tono {
  nombre: string;
  hex: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion_corta: string | null;
  imagen_url: string | null;
  categoria: Categoria;
  subcategoria: string;
  // Solo aplica a productos de Fragancias (SUBCATEGORIAS del grupo Fragancias).
  aroma: string[] | null;
  estado: Estado;
  precio: number;
  destacado: boolean;
  tonos: Tono[] | null;
  orden_display: number;
  created_at: string;
}

export const CATEGORIAS: Categoria[] = [
  "Aritos",
  "Pulseras",
  "Collares",
  "Anillos",
  "Spray Textil",
  "Difusor",
  "Cremas",
  "Vela Aromática",
  "Invierno",
];

export const ESTADOS: Estado[] = ["Disponible", "Sin stock"];

// Cada categoria es su propia (unica) subcategoria: no hay division interna
// como en el catalogo original. Si mas adelante hace falta separar por tipo
// (ej: Aritos -> Argolla/Colgante), basta con agregar mas valores aca.
export const SUBCATEGORIAS: Record<Categoria, string[]> = {
  Aritos: ["Aritos"],
  Pulseras: ["Pulseras"],
  Collares: ["Collares"],
  Anillos: ["Anillos"],
  "Spray Textil": ["Spray Textil"],
  Difusor: ["Difusor"],
  Cremas: ["Cremas"],
  "Vela Aromática": ["Vela Aromática"],
  Invierno: ["Invierno"],
};

// Agrupacion para el filtro del catalogo: un grupo se toca y despliega sus
// categorias reales. Categorias fuera de GRUPOS_FILTRO (ej: Invierno) se
// muestran como filtro plano, sin desplegable.
export interface GrupoFiltro {
  label: string;
  categorias: Categoria[];
}

export const GRUPOS_FILTRO: GrupoFiltro[] = [
  { label: "Accesorios", categorias: ["Aritos", "Pulseras", "Collares", "Anillos"] },
  {
    label: "Fragancias",
    categorias: ["Spray Textil", "Difusor", "Cremas", "Vela Aromática"],
  },
];

export const CATEGORIAS_SUELTAS: Categoria[] = ["Invierno"];
