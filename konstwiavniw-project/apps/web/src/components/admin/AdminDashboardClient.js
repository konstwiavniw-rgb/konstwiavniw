"use client";

import { useState } from "react";
import {
  createCourse, togglePublish, deleteCourse, addModule, addLesson, deleteResource,
} from "@/app/admin/actions";

const TITLES = {
  overview: "Vin Jeneral", students: "Jere Elèv", courses: "Jere Kou & Modil",
  newcourse: "Kreye Nouvo Kou", resources: "Jere Resous",
};

export default function AdminDashboardClient({ stats, students, courses, resources }) {
  const [view, setView] = useState("overview");
  const [message, setMessage] = useState("");

  async function handleCreateCourse(formData) {
    const { error } = await createCourse(formData);
    setMessage(error ? `Erè: ${error}` : "Kou a kreye! Ale nan 'Kou & Modil' pou ajoute modil.");
    if (!error) setView("courses");
  }

  return (
    <>
      <div className="topbar">
        <div>
          <span className="greeting-eyebrow">Dashboard Admin</span>
          <h1 className="greeting">{TITLES[view]}</h1>
        </div>
      </div>

      <div className="nav-list" style={{ flexDirection: "row", gap: 8, marginBottom: 30, flexWrap: "wrap" }}>
        {Object.entries(TITLES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className="btn btn-outline btn-sm"
            style={view === key ? { background: "var(--navy-800)", color: "#fff" } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {message && <div className="alert success" style={{ maxWidth: 500 }}>{message}</div>}

      {view === "overview" && (
        <div>
          <div className="summary-row">
            <div className="summary-card"><span className="label">Total Elèv</span><span className="value">{stats.studentCount}</span></div>
            <div className="summary-card"><span className="label">Kou Piblye</span><span className="value">{stats.publishedCount}</span></div>
            <div className="summary-card"><span className="label">Pwogrè Mwayèn</span><span className="value">{stats.avgProgress}<span>%</span></span></div>
            <div className="summary-card"><span className="label">Leson Total</span><span className="value">{stats.lessonCount}</span></div>
          </div>
        </div>
      )}

      {view === "students" && (
        <div className="table-card table-scroll">
          <table>
            <thead><tr><th>Non</th><th>Imèl</th><th>Kou Enskri</th><th>Pwogrè Mwayèn</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="cell-name">{s.full_name}</td>
                  <td className="cell-sub">{s.email}</td>
                  <td>{s.courseCount} kou</td>
                  <td><span className="pill gold">{s.avgProgress}% mwayèn</span></td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan={4} className="cell-sub">Poko gen elèv enskri.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === "courses" && (
        <div className="course-manage-grid">
          {courses.map((c) => (
            <div className="course-manage-card" key={c.id}>
              <div className="cm-top">
                <span className="ic">{c.icon}</span>
                <div className="cm-actions">
                  <form action={togglePublish.bind(null, c.id, c.is_published)}>
                    <button className="icon-btn" title="Pibliye/Kache">{c.is_published ? "👁" : "🚫"}</button>
                  </form>
                  <form action={deleteCourse.bind(null, c.id)}>
                    <button className="icon-btn" title="Efase">🗑</button>
                  </form>
                </div>
              </div>
              <div className="cm-body">
                <span className="cm-badge">{c.category}</span>
                <h3>{c.title}</h3>
                <div className="cm-meta-row">
                  <span><b>{c.modules?.length || 0}</b> modil</span>
                  <span><b>{c.lessonCount}</b> leson</span>
                  <span className="pill" style={{ background: c.is_published ? "rgba(46,125,79,.1)" : "var(--offwhite)", color: c.is_published ? "#2E7D4F" : "var(--muted)" }}>
                    {c.is_published ? "Pibliye" : "Bouyon"}
                  </span>
                </div>

                <div className="accordion">
                  {(c.modules || []).map((m) => (
                    <details className="acc-item" key={m.id}>
                      <summary className="acc-head">{m.title}</summary>
                      <div className="acc-body">
                        {(m.lessons || []).map((l) => (
                          <div className="lesson-mini" key={l.id}>
                            <span className="tag">{l.type}</span> {l.title}
                          </div>
                        ))}
                        <form action={addLesson.bind(null, m.id)} style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <input name="title" placeholder="Tit leson" required style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--line)", fontSize: ".78rem", flex: 1, minWidth: 120 }} />
                          <input name="video_url" placeholder="Lyen videyo (opsyonèl)" style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--line)", fontSize: ".78rem", flex: 1, minWidth: 120 }} />
                          <button type="submit" className="add-line" style={{ border: "1px solid var(--gold-500)", color: "var(--gold-500)", borderRadius: 999, padding: "6px 12px", fontSize: ".74rem" }}>+ Leson</button>
                        </form>
                      </div>
                    </details>
                  ))}
                </div>

                <form action={addModule.bind(null, c.id)} style={{ marginTop: 12, display: "flex", gap: 6 }}>
                  <input name="title" placeholder="Tit nouvo modil" required style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--line)", fontSize: ".8rem", flex: 1 }} />
                  <button type="submit" className="btn btn-outline btn-sm">+ Modil</button>
                </form>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="lead">Poko gen kou. Ale nan "Kreye Nouvo Kou".</p>}
        </div>
      )}

      {view === "newcourse" && (
        <div className="form-card" style={{ maxWidth: 560 }}>
          <form action={handleCreateCourse}>
            <div className="form-grid">
              <div className="field full">
                <label>Tit Kou a</label>
                <input name="title" type="text" required placeholder="Egzanp: Monetizasyon Canva" />
              </div>
              <div className="field full">
                <label>Deskripsyon</label>
                <textarea name="description" rows={3} placeholder="Kout deskripsyon sou kou a..." />
              </div>
              <div className="field">
                <label>Kategori</label>
                <select name="category">
                  <option>Design</option><option>IA</option><option>Videyo</option>
                  <option>Monetizasyon</option><option>Piblisite</option>
                </select>
              </div>
              <div className="field">
                <label>Ikòn (emoji)</label>
                <input name="icon" type="text" placeholder="🎨" defaultValue="📘" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Kreye Kou a</button>
          </form>
        </div>
      )}

      {view === "resources" && (
        <div className="table-card table-scroll">
          <table>
            <thead><tr><th>Fichye</th><th>Kou</th><th>Tip</th><th>Tay</th><th></th></tr></thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td className="cell-name">{r.title}</td>
                  <td>{r.courseTitle}</td>
                  <td><span className="pill gold">{(r.file_type || "").toUpperCase()}</span></td>
                  <td className="cell-sub">{r.file_size_kb ? `${r.file_size_kb} KB` : "—"}</td>
                  <td>
                    <form action={deleteResource.bind(null, r.id)}>
                      <button className="btn-danger-ghost">Efase</button>
                    </form>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && <tr><td colSpan={5} className="cell-sub">Poko gen resous.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
