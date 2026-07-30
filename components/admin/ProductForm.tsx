"use client";

import { useState } from "react";
import type { Categoria, Estado, Producto, Tono } from "@/lib/types";
import {
  CATEGORIAS,
  CATEGORIAS_SUELTAS,
  ESTADOS,
  GRUPOS_FILTRO,
  SUBCATEGORIAS,
} from "@/lib/types";
import { actualizarProducto, crearProducto, subirImagen } from "@/lib/db";
import { comprimirImagen } from "@/lib/imagen";

interface Props {
  producto: Producto | null;
  onClose: () => void;
  onSaved: () => void;
}

// Grupo (filtro principal del Catalogo) al que pertenece una categoria real.
// Las sueltas (ej: Invierno) son su propio grupo.
function grupoDeCategoria(c: Categoria): string {
  return GRUPOS_FILTRO.find((g) => g.categorias.includes(c))?.label ?? c;
}

function categoriasDelGrupo(grupo: string): Categoria[] {
  return GRUPOS_FILTRO.find((g) => g.label === grupo)?.categorias ?? [grupo as Categoria];
}

const OPCIONES_GRUPO: string[] = [
  ...GRUPOS_FILTRO.map((g) => g.label),
  ...CATEGORIAS_SUELTAS,
];

// Colores: solo aplica a Accesorios, paleta fija (no hay input libre).
const COLORES_DISPONIBLES: Tono[] = [
  { nombre: "Dorado", hex: "#d4af37" },
  { nombre: "Plateado", hex: "#c0c0c0" },
];

export default function ProductForm({ producto, onClose, onSaved }: Props) {
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    producto?.descripcion_corta ?? ""
  );
  const [precio, setPrecio] = useState(
    producto ? String(producto.precio) : ""
  );
  const [categoria, setCategoria] = useState<Categoria>(
    producto?.categoria ?? CATEGORIAS[0]
  );
  const [grupo, setGrupo] = useState(grupoDeCategoria(categoria));
  const esAccesorio = grupo === "Accesorios";
  const esFragancia = grupo === "Fragancias";
  const [aroma, setAroma] = useState(producto?.aroma ?? "");
  const [subcategoria, setSubcategoria] = useState(
    producto?.subcategoria ?? SUBCATEGORIAS[CATEGORIAS[0]][0]
  );
  const [estado, setEstado] = useState<Estado>(
    producto?.estado ?? "Disponible"
  );
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);
  const [tonos, setTonos] = useState<Tono[]>(producto?.tonos ?? []);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    producto?.imagen_url ?? null
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cambiarCategoria(c: Categoria) {
    setCategoria(c);
    setSubcategoria(SUBCATEGORIAS[c][0]);
  }

  function cambiarGrupo(g: string) {
    setGrupo(g);
    cambiarCategoria(categoriasDelGrupo(g)[0]);
    if (g !== "Accesorios") setTonos([]);
    if (g !== "Fragancias") setAroma("");
  }

  function elegirArchivo(f: File | null) {
    setArchivo(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  function toggleColor(color: Tono) {
    setTonos((prev) =>
      prev.some((t) => t.nombre === color.nombre)
        ? prev.filter((t) => t.nombre !== color.nombre)
        : [...prev, color]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const precioNumero = Number(precio);
    if (!Number.isInteger(precioNumero) || precioNumero < 0) {
      setError("El precio debe ser un número entero mayor o igual a 0");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      let imagen_url = producto?.imagen_url ?? null;
      if (archivo) {
        const blob = await comprimirImagen(archivo);
        imagen_url = await subirImagen(blob, `${crypto.randomUUID()}.webp`);
      }
      const datos = {
        nombre: nombre.trim(),
        descripcion_corta: descripcion.trim(),
        imagen_url,
        categoria,
        subcategoria,
        aroma: esFragancia ? aroma.trim() || null : null,
        estado,
        precio: precioNumero,
        destacado,
        tonos: tonos.length > 0 ? tonos : null,
      };
      if (producto) {
        await actualizarProducto(producto.id, datos);
      } else {
        await crearProducto({ ...datos, orden_display: 999 });
      }
      onSaved();
    } catch {
      setError("No se pudo guardar. Probá de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="font-serif text-xl text-marias-700">
          {producto ? "Editar producto" : "Nuevo producto"}
        </h2>

        <label className="mt-4 block text-sm text-neutral-600">
          Nombre *
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-marias-300"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-600">
          Descripción corta ({descripcion.length}/150)
          <textarea
            value={descripcion}
            maxLength={150}
            rows={3}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-marias-300"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-600">
          Precio (ARS) *
          <input
            type="number"
            min={0}
            step={1}
            required
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-marias-300"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-sm text-neutral-600">
            Categoría
            <select
              value={grupo}
              onChange={(e) => cambiarGrupo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm"
            >
              {OPCIONES_GRUPO.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-neutral-600">
            Subcategoría
            <select
              value={categoria}
              onChange={(e) => cambiarCategoria(e.target.value as Categoria)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm"
            >
              {categoriasDelGrupo(grupo).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm text-neutral-600">
          Estado
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as Estado)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm"
          >
            {ESTADOS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>

        <label className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={destacado}
            onChange={(e) => setDestacado(e.target.checked)}
            className="h-4 w-4 accent-marias-400"
          />
          Destacado
        </label>

        {esFragancia && (
          <label className="mt-4 block text-sm text-neutral-600">
            Aroma
            <input
              value={aroma}
              onChange={(e) => setAroma(e.target.value)}
              placeholder="Ej: Lavanda"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-marias-300"
            />
          </label>
        )}

        {esAccesorio && (
          <div className="mt-4">
            <span className="text-sm text-neutral-600">Colores</span>
            <div className="mt-2 flex gap-3">
              {COLORES_DISPONIBLES.map((color) => {
                const activo = tonos.some((t) => t.nombre === color.nombre);
                return (
                  <label
                    key={color.nombre}
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-neutral-600"
                  >
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={() => toggleColor(color)}
                      className="h-4 w-4 accent-marias-400"
                    />
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.nombre}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <label className="mt-4 block text-sm text-neutral-600">
          Imagen
          <input
            type="file"
            accept="image/*"
            onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-xs text-neutral-500 file:mr-3 file:rounded-full file:border-0 file:bg-marias-50 file:px-4 file:py-2 file:text-xs file:text-marias-700"
          />
        </label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-32 w-32 rounded-lg object-cover"
          />
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm text-marias-600 ring-1 ring-marias-200 hover:bg-marias-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="rounded-full bg-marias-400 px-5 py-2 text-sm font-medium text-marias-700 hover:bg-marias-300 disabled:opacity-50"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
