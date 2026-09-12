// Kliyan Supabase pou itilize nan Server Components ak Server Actions.
// Li li/ekri sesyon an nan cookies rekèt la, sa fè Row Level Security
// aplike ak vre itilizatè konekte a (auth.uid()) — pa yon kle admin.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Rive lè yo rele l apati yon Server Component san
            // middleware — san danje, middleware.js jere refresh sesyon an.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}
