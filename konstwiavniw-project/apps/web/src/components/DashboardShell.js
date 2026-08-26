"use client";

import { useState } from "react";
import Logo from "./Logo";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

/**
 * Chal pataje ant Student ak Admin Dashboard: sidebar + hamburger mobil.
 * navItems: [{ label, icon, href, active }]
 * userTag: "Kont Elèv" oswa "Kont Admin"
 */
export default function DashboardShell({ navItems, userName, userTag, initials, children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Logo light />
        <span className="admin-tag">{userTag}</span>

        <nav className="nav-list">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="ic">{item.icon}</span> {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="user-mini">
            <div className="avatar">{initials}</div>
            <div>
              <div className="name">{userName}</div>
              <div className="role">{userTag}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{ color: "#B9C2D6", marginTop: 12, fontSize: ".8rem" }}
          >
            ↩ Dekonekte
          </button>
        </div>
      </aside>

      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      <main className="main">
        <button className="hamburger" onClick={() => setOpen(!open)} style={{ marginBottom: 12 }}>
          ☰
        </button>
        {children}
      </main>
    </div>
  );
}
