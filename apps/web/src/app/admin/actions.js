"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Verifye wòl admin AVAN chak aksyon — kwochè sekirite adisyonèl.
 * Menm san verifikasyon sa a, RLS ("Admin jere kou/modil/leson") ta
 * bloke operasyon an nan baz done a; sa a jis retounen yon erè klè pi vit.
 */
async function requireAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function createCourse(formData) {
  const supabase = createClient();
  const user = await requireAdmin(supabase);
  if (!user) return { error: "Aksè refize." };

  const title = formData.get("title");
  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { error } = await supabase.from("courses").insert({
    title,
    slug: `${slug}-${Date.now().toString(36)}`,
    description: formData.get("description"),
    category: formData.get("category"),
    icon: formData.get("icon") || "📘",
    created_by: user.id,
    is_published: false,
  });

  revalidatePath("/admin");
  return { error: error?.message || null };
}

export async function togglePublish(courseId, current) {
  const supabase = createClient();
  const user = await requireAdmin(supabase);
  if (!user) return { error: "Aksè refize." };
  const { error } = await supabase.from("courses").update({ is_published: !current }).eq("id", courseId);
  revalidatePath("/admin");
  revalidatePath("/");
  return { error: error?.message || null };
}

export async function deleteCourse(courseId) {
  const supabase = createClient();
  const user = await requireAdmin(supabase);
  if (!user) return { error: "Aksè refize." };
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  revalidatePath("/admin");
  return { error: error?.message || null };
}

export async function addModule(courseId, formData) {
  const supabase = createClient();
  const user = await requireAdmin(supabase);
  if (!user) return { error: "Aksè refize." };
  const { error } = await supabase.from("modules").insert({
    course_id: courseId,
    title: formData.get("title"),
    position: Number(formData.get("position") || 0),
  });
  revalidatePath("/admin");
  return { error: error?.message || null };
}

export async function addLesson(moduleId, formData) {
  const supabase = createClient();
  const user = await requireAdmin(supabase);
  if (!user) return { error: "Aksè refize." };
  const { error } = await supabase.from("lessons").insert({
    module_id: moduleId,
    title: formData.get("title"),
    type: formData.get("type") || "video",
    video_url: formData.get("video_url") || null,
  });
  revalidatePath("/admin");
  return { error: error?.message || null };
}

export async function deleteResource(resourceId) {
  const supabase = createClient();
  const user = await requireAdmin(supabase);
  if (!user) return { error: "Aksè refize." };
  const { error } = await supabase.from("resources").delete().eq("id", resourceId);
  revalidatePath("/admin");
  return { error: error?.message || null };
}
