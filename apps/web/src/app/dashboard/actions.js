"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Make yon leson kòm fini pou ITILIZATÈ KI KONEKTE A SÈLMAN.
 * RLS ("Elèv modifye pwòp pwogrè") anpeche l afekte done yon lòt moun
 * menm si yon moun ta eseye chanje lessonId la nan rekèt la.
 */
export async function markLessonComplete(lessonId) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Pa konekte." };

  const { error } = await supabase.from("lesson_progress").upsert(
    { user_id: user.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" }
  );

  revalidatePath("/dashboard");
  return { error: error?.message || null };
}
