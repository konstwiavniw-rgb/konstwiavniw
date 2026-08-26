// Kliyan Supabase pou itilize nan Client Components ("use client")
// — egzanp: paj Login/Register, bouton "Fini Leson".
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
