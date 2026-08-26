// Fonksyon otantifikasyon — sèvi ak kliyan navigatè a paske yo rele
// apati Client Components (fòm Login/Register).
import { createClient } from "@/lib/supabase/client";

export async function signUp({ fullName, email, password }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }, // trigger la kreye 'profiles' otomatikman
  });
  return { data, error };
}

export async function signIn({ email, password }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Retounen 'student' oswa 'admin' pou n konnen ki dashboard pou voye moun nan. */
export async function getCurrentUserRole() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  return data;
}
