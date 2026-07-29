export type Categoria = "Aritos" | "Pulseras" | "Collares" | "Anillos";
export type Estado = "Disponible" | "Por Encargo" | "Sin stock";

export interface Tono {
  nombre: string;
  hex: string;
}

export interface Producto {
  id: string;
  nombre: string;
  marca: string | null;
  descripcion_corta: string | null;
  imagen_url: string | null;
  categoria: Categoria;
  subcategoria: string;
  estado: Estado;
  precio: number;
  destacado: boolean;
  tonos: Tono[] | null;
  orden_display: number;
  created_at: string;
}

export const CATEGORIAS: Categoria[] = ["Aritos", "Pulseras", "Collares", "Anillos"];

export const ESTADOS: Estado[] = ["Disponible", "Por Encargo", "Sin stock"];

// Cada categoria es su propia (unica) subcategoria: no hay division interna
// como en el catalogo original. Si mas adelante hace falta separar por tipo
// (ej: Aritos -> Argolla/Colgante), basta con agregar mas valores aca.
export const SUBCATEGORIAS: Record<Categoria, string[]> = {
  Aritos: ["Aritos"],
  Pulseras: ["Pulseras"],
  Collares: ["Collares"],
  Anillos: ["Anillos"],
};
