import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/DashboardShell";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

const NAV = [
  { label: "Dashboard Admin", icon: "▦", href: "/admin", active: true },
];

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminProfile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  // --- Kou yo, ak modil + leson enbrike ---
  const { data: coursesRaw } = await supabase
    .from("courses")
    .select("id, title, description, category, icon, is_published, modules(id, title, position, lessons(id, title, type))")
    .order("created_at", { ascending: false });

  const courses = (coursesRaw || []).map((c) => ({
    ...c,
    modules: (c.modules || []).sort((a, b) => a.position - b.position),
    lessonCount: (c.modules || []).reduce((sum, m) => sum + (m.lessons?.length || 0), 0),
  }));

  // --- Tout elèv (profiles ki gen wòl student) ---
  const { data: studentProfiles } = await supabase
    .from("profiles").select("id, full_name").eq("role", "student");

  const { data: allEnrollments } = await supabase.from("enrollments").select("user_id, course_id");
  const { data: allProgress } = await supabase.from("course_progress").select("user_id, percent_complete");

  const students = (studentProfiles || []).map((s) => {
    const courseCount = (allEnrollments || []).filter((e) => e.user_id === s.id).length;
    const rows = (allProgress || []).filter((p) => p.user_id === s.id);
    const avgProgress = rows.length ? Math.round(rows.reduce((sum, r) => sum + (r.percent_complete || 0), 0) / rows.length) : 0;
    return { id: s.id, full_name: s.full_name, email: "—", courseCount, avgProgress };
  });

  // --- Resous, ak tit kou a jwenn ---
  const { data: resourcesRaw } = await supabase.from("resources").select("id, title, file_type, file_size_kb, course_id");
  const resources = (resourcesRaw || []).map((r) => ({
    ...r,
    courseTitle: courses.find((c) => c.id === r.course_id)?.title || "—",
  }));

  // --- Estatistik jeneral ---
  const publishedCount = courses.filter((c) => c.is_published).length;
  const lessonCount = courses.reduce((sum, c) => sum + c.lessonCount, 0);
  const avgProgress = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.avgProgress, 0) / students.length)
    : 0;

  const stats = { studentCount: students.length, publishedCount, avgProgress, lessonCount };

  const fullName = adminProfile?.full_name || "Admin";
  const initials = fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <DashboardShell navItems={NAV} userName={fullName} userTag="Kont Admin" initials={initials}>
      <AdminDashboardClient stats={stats} students={students} courses={courses} resources={resources} />
    </DashboardShell>
  );
}
