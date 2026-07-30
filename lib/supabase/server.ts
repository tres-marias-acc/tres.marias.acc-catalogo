import { createClient } from "@supabase/supabase-js";
import { ordenarProductos } from "@/lib/catalog";
import type { Producto } from "@/lib/types";
import { MOCK_PRODUCTOS } from "@/lib/mockProductos";

// Lectura publica para la landing (sin cookies ni sesion).
// Devuelve productos de muestra si Supabase no esta configurado, para poder
// visualizar el catalogo antes de cargar el stock real.
export async function obtenerProductos(): Promise<Producto[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return MOCK_PRODUCTOS;
  try {
    const supabase = createClient(url, anon);
    const { data, error } = await supabase.from("productos").select("*");
    if (error || !data) return [];
    return ordenarProductos(data as Producto[]);
  } catch {
    return [];
  }
}
