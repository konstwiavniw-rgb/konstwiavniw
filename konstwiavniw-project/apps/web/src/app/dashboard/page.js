import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/DashboardShell";
import { markLessonComplete } from "./actions";

const NAV = [
  { label: "Dashboard", icon: "▦", href: "/dashboard", active: true },
  { label: "Kou mwen yo", icon: "🎓", href: "/dashboard#kou" },
  { label: "Resous", icon: "📁", href: "/dashboard#resous" },
];

export default async function StudentDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id, courses(id, title, icon, category)")
    .eq("user_id", user.id);

  const { data: progressRows } = await supabase
    .from("course_progress")
    .select("course_id, percent_complete, total_lessons, completed_lessons")
    .eq("user_id", user.id);

  const progressByCourse = Object.fromEntries((progressRows || []).map((p) => [p.course_id, p]));

  // Leson pou premye kou a (pou lis "Leson ki disponib")
  const firstCourseId = enrollments?.[0]?.course_id;
  let lessons = [];
  if (firstCourseId) {
    const { data } = await supabase
      .from("lessons")
      .select("id, title, duration_seconds, modules!inner(course_id, position), position")
      .eq("modules.course_id", firstCourseId)
      .order("position");
    lessons = data || [];
  }
  const { data: completedRows } = await supabase
    .from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id);
  const completedSet = new Set((completedRows || []).filter((r) => r.completed).map((r) => r.lesson_id));

  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, file_type, file_size_kb, course_id")
    .in("course_id", (enrollments || []).map((e) => e.course_id));

  const overallPercent = progressRows?.length
    ? Math.round(progressRows.reduce((s, p) => s + (p.percent_complete || 0), 0) / progressRows.length)
    : 0;
  const totalCompleted = progressRows?.reduce((s, p) => s + (p.completed_lessons || 0), 0) || 0;
  const totalLessons = progressRows?.reduce((s, p) => s + (p.total_lessons || 0), 0) || 0;

  const fullName = profile?.full_name || "Elèv";
  const initials = fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <DashboardShell navItems={NAV} userName={fullName} userTag="Kont Elèv" initials={initials}>
      <div className="topbar">
        <div>
          <span className="greeting-eyebrow">Dashboard Elèv</span>
          <h1 className="greeting">Byenveni, {fullName.split(" ")[0]} 👋</h1>
        </div>
      </div>

      <div className="summary-row">
        <div className="summary-card"><span className="label">Kou an kou</span><span className="value">{enrollments?.length || 0} <span>aktif</span></span></div>
        <div className="summary-card"><span className="label">Pwogrè jeneral</span><span className="value">{overallPercent}<span>%</span></span></div>
        <div className="summary-card"><span className="label">Leson konplete</span><span className="value">{totalCompleted}<span>/{totalLessons}</span></span></div>
        <div className="summary-card"><span className="label">Resous disponib</span><span className="value">{resources?.length || 0} <span>fichye</span></span></div>
      </div>

      <section id="kou">
        <div className="section-head"><h2>Kou mwen yo</h2></div>
        {enrollments && enrollments.length > 0 ? (
          <div className="cards">
            {enrollments.map((e) => {
              const p = progressByCourse[e.course_id];
              const pct = p?.percent_complete || 0;
              return (
                <div className="card" key={e.course_id}>
                  <div className="card-top">{e.courses?.icon || "📘"}</div>
                  <div className="card-body">
                    <span className="badge">{e.courses?.category}</span>
                    <h3>{e.courses?.title}</h3>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="progress-meta"><span>{pct}% konplete</span><span>{p?.completed_lessons || 0}/{p?.total_lessons || 0} leson</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="lead" style={{ color: "var(--muted)" }}>
            Ou poko enskri nan okenn kou. Ale nan Home Page pou chwazi premye kou ou.
          </p>
        )}
      </section>

      {lessons.length > 0 && (
        <section>
          <div className="section-head"><h2>Leson ki disponib</h2></div>
          <div className="lesson-list">
            {lessons.map((l) => {
              const done = completedSet.has(l.id);
              return (
                <div className="lesson-row" key={l.id}>
                  <div className="lesson-icon">{done ? "✓" : "▶"}</div>
                  <div className="lesson-info">
                    <div className="t">{l.title}</div>
                    <div className="s">{l.duration_seconds ? `${Math.round(l.duration_seconds / 60)} min` : ""}</div>
                  </div>
                  {done ? (
                    <span className="lesson-status done">Fini</span>
                  ) : (
                    <form action={markLessonComplete.bind(null, l.id)}>
                      <button type="submit" className="lesson-status next">Make fini</button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section id="resous">
        <div className="section-head"><h2>Resous ou ka telechaje</h2></div>
        {resources && resources.length > 0 ? (
          <div className="resource-grid">
            {resources.map((r) => (
              <div className="resource-card" key={r.id}>
                <span className="resource-icon">📄</span>
                <div className="resource-info"><div className="t">{r.title}</div><div className="s">{r.file_size_kb ? `${r.file_size_kb} KB` : ""}</div></div>
                <span className="resource-dl">↓ {(r.file_type || "").toUpperCase()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="lead" style={{ color: "var(--muted)" }}>Pa gen resous disponib pou kounye a.</p>
        )}
      </section>
    </DashboardShell>
  );
}
