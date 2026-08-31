import { createClient } from "@/lib/supabase/client";
import { ordenarProductos } from "@/lib/catalog";
import type { Producto } from "@/lib/types";
import { MOCK_PRODUCTOS } from "@/lib/mockProductos";

type ProductoNuevo = Omit<Producto, "id" | "created_at">;

const SUPABASE_CONFIGURADO =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Devuelve productos de muestra si Supabase no esta configurado, para poder
// visualizar el panel admin antes de cargar el stock real.
export async function listarProductos(): Promise<Producto[]> {
  if (!SUPABASE_CONFIGURADO) return ordenarProductos(MOCK_PRODUCTOS);
  const { data, error } = await createClient().from("productos").select("*");
  if (error) throw error;
  return ordenarProductos((data ?? []) as Producto[]);
}

export async function crearProducto(p: ProductoNuevo): Promise<void> {
  const { error } = await createClient().from("productos").insert(p);
  if (error) throw error;
}

export async function actualizarProducto(
  id: string,
  p: Partial<ProductoNuevo>
): Promise<void> {
  const { error } = await createClient()
    .from("productos")
    .update(p)
    .eq("id", id);
  if (error) throw error;
}

export async function eliminarProducto(id: string): Promise<void> {
  const { error } = await createClient()
    .from("productos")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function guardarOrden(
  items: { id: string; orden_display: number }[]
): Promise<void> {
  const supabase = createClient();
  const resultados = await Promise.all(
    items.map(({ id, orden_display }) =>
      supabase.from("productos").update({ orden_display }).eq("id", id)
    )
  );
  const fallo = resultados.find((r) => r.error);
  if (fallo?.error) throw fallo.error;
}

export async function subirImagen(blob: Blob, nombre: string): Promise<string> {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("productos-img")
    .upload(nombre, blob, { contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("productos-img").getPublicUrl(nombre).data
    .publicUrl;
}

// Extrae el path del archivo dentro del bucket a partir de la URL publica
// que devuelve Supabase (todo lo que va despues de "/<bucket>/").
function pathDesdeUrlPublica(url: string, bucket: string): string | null {
  const marcador = `/${bucket}/`;
  const i = url.indexOf(marcador);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marcador.length));
}

// Borrado best-effort: si la imagen ya no existe o la URL no matchea el
// bucket, no rompe el flujo que la llama (eliminar/editar producto).
export async function eliminarImagen(url: string | null): Promise<void> {
  if (!url) return;
  const path = pathDesdeUrlPublica(url, "productos-img");
  if (!path) return;
  try {
    await createClient().storage.from("productos-img").remove([path]);
  } catch {
    // No-op: no bloquear al usuario por una limpieza de storage fallida.
  }
}
