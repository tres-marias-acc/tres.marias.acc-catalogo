# Tres Marías — Landing Catalog

Landing catalog + panel admin para accesorios femeninos (aritos, pulseras, collares, anillos).
Next.js 16 · Tailwind v4 · Supabase · Framer Motion.

Identidad visual y catálogo propios de Tres Marías sobre la misma base técnica y lógica de negocio.

## Setup local

```bash
npm install
cp .env.example .env.local   # completar con datos de Supabase
npm run dev
```

## Configurar Supabase (una sola vez)

El proyecto de Supabase de Tres Marías está en una cuenta separada (a nombre del cliente). Pasos:

1. Crear proyecto en [supabase.com](https://supabase.com) (free tier) o pedir acceso al ya existente.
2. En **SQL Editor**, correr `supabase/schema.sql` y después `supabase/seed.sql` (seed opcional, son productos de ejemplo para probar el catálogo antes de cargar el stock real).
   - Si las policies de storage fallan con "must be owner of table objects": crear el bucket `productos-img` (público) desde **Storage** y las 4 policies desde **Storage → Policies** en el dashboard (SELECT para todos; INSERT/UPDATE/DELETE solo `authenticated`, todas con condición `bucket_id = 'productos-img'`). El resto del script corre igual.
3. En **Authentication → Users**, crear el usuario admin (email + password). Desactivar signups en **Authentication → Sign In / Up** si está habilitado.
4. En **Project Settings → API**, copiar `URL` y `anon public key` a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Deploy en Vercel

1. Subir el repo a GitHub.
2. En [vercel.com](https://vercel.com): **New Project** → importar el repo.
3. Agregar las dos env vars de arriba, más `NEXT_PUBLIC_SITE_URL` con la URL final (ej: `https://tres-marias.vercel.app`) para que la imagen de preview (og:image) funcione al compartir el link.
4. Deploy. Cada push a `main` redeploya solo.

## Pendiente antes de lanzar

- **Logo real**: `public/brand/caligrafia.png` (hero + footer) ya es el logo real. `public/brand/monogram.svg` y `app/icon.svg` siguen siendo placeholders de texto ("TM") con la paleta de marca — reemplazar cuando llegue una versión ícono/favicon del logo.
- **Fuente de título**: `app/layout.tsx` usa Cormorant Garamond como placeholder hasta tener los archivos `.woff2` de RoxboroughCF (fuente de marca). El comentario en ese archivo explica el cambio a `next/font/local`.
- **Zona de envíos**: se sacó la línea de ubicación del footer (era específica del proyecto base). Agregarla de nuevo en `components/landing/Footer.tsx` si se quiere mostrar ciudad/zona de envíos.

## Personalizar (sin tocar componentes)

- **WhatsApp, tagline, Instagram, email, nota por encargo** → `lib/config.ts`.
  - Número WhatsApp: código de país + número, sin `+` ni espacios. Ej: `5491112345678`.
- **Categorías y subcategorías** → `lib/types.ts` (`CATEGORIAS`, `SUBCATEGORIAS`). Hoy cada categoría es su propia subcategoría única (sin división interna); si hace falta separar por tipo (ej: Aritos → Argolla/Colgante) alcanza con agregar valores ahí. También hay que actualizar el `check` de `categoria`/`subcategoria` en `supabase/schema.sql` si el proyecto Supabase ya está creado.
- **Paleta de colores** → `app/globals.css` (`@theme`, tokens `--color-marias-*`).
- **Logos** → `public/brand/caligrafia.png` (hero + footer) y `public/brand/monogram.svg` (navbar/admin, placeholder). Favicon: `app/icon.svg` (placeholder).
- **Fuentes** → `app/layout.tsx` (`next/font`).
- **Productos** → todo desde `/admin` (crear, editar, eliminar, reordenar con drag & drop, cambiar estado, subir fotos).

## Estructura

- `app/page.tsx` — landing (ISR 60s)
- `app/admin` — panel admin (protegido por Supabase Auth)
- `components/landing`, `components/admin` — UI
- `lib/` — config, tipos, lógica, clientes Supabase
- `supabase/` — schema + seed SQL
- `tests/` — tests de lógica (`npm run test`)
