import { createClient } from "@supabase/supabase-js";

// Lo llama el cron de vercel.json. Una query real a la base cuenta como
// actividad y evita que Supabase (plan gratis) pause el proyecto por inactividad.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return Response.json({ ok: false, error: "Supabase no configurado" }, { status: 500 });
  }
  const { error } = await createClient(url, anon)
    .from("productos")
    .select("id")
    .limit(1);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 502 });
  }
  return Response.json({ ok: true, at: new Date().toISOString() });
}
