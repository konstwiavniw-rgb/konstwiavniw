"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { signIn, signUp, getCurrentUserRole } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") === "register" ? "register" : "login");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({ fullName: "", email: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function goToRightDashboard() {
    const profile = await getCurrentUserRole();
    router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(loginData);
    setLoading(false);
    if (error) {
      setError("Imèl oswa modpas la pa kòrèk.");
      return;
    }
    await goToRightDashboard();
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (regData.password !== regData.password2) {
      setError("Modpas yo pa idantik.");
      return;
    }
    if (regData.password.length < 8) {
      setError("Modpas la dwe gen omwen 8 karaktè.");
      return;
    }
    setLoading(true);
    const { error } = await signUp(regData);
    setLoading(false);
    if (error) {
      setError(error.message || "Nou pa t' ka kreye kont la. Eseye ankò.");
      return;
    }
    await goToRightDashboard();
  }

  return (
    <div className="auth-screen">
      <div className="brand-panel">
        <Logo light />
        <div className="brand-mid">
          <span className="eyebrow">Aprann • Kreye • Devlope • Reyisi</span>
          <h1>Antre epi kontinye <em>konstwi avni ou</em>.</h1>
          <p>Aksè a tout kou ou yo, pwogrè ou, ak resous ou yo — nan yon sèl kote, an sekirite.</p>
          <div className="steps">
            <div className="step"><span className="num">01</span><span className="label">Aprann</span></div>
            <div className="step"><span className="num">02</span><span className="label">Kreye</span></div>
            <div className="step"><span className="num">03</span><span className="label">Devlope</span></div>
            <div className="step"><span className="num">04</span><span className="label">Reyisi</span></div>
          </div>
        </div>
        <div className="brand-foot">© 2026 Konstwiavniw. Tout dwa rezève.</div>
      </div>

      <div className="form-panel">
        <div className="form-card-wrap">
          <div className="tabs">
            <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
            <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Kreye kont</button>
          </div>

          {error && <div className="alert">{error}</div>}

          {tab === "login" ? (
            <div>
              <div className="form-head">
                <h2>Byenveni ankò</h2>
                <p>Konekte pou kontinye aprantisaj ou.</p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Imèl</label>
                  <input type="email" required value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>Modpas</label>
                  <input type="password" required value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                  {loading ? "Ap konekte..." : "Konekte"}
                </button>
              </form>
              <div className="form-foot">
                Poko gen kont? <button className="link-gold" onClick={() => setTab("register")}>Kreye youn</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="form-head">
                <h2>Kreye kont ou</h2>
                <p>Kòmanse premye leson w gratis jodi a.</p>
              </div>
              <form onSubmit={handleRegister}>
                <div className="field">
                  <label>Non konplè</label>
                  <input type="text" required value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })} />
                </div>
                <div className="field">
                  <label>Imèl</label>
                  <input type="email" required value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>Modpas</label>
                  <input type="password" required minLength={8} value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })} />
                  <span className="field-hint">Omwen 8 karaktè.</span>
                </div>
                <div className="field">
                  <label>Konfime modpas</label>
                  <input type="password" required value={regData.password2}
                    onChange={(e) => setRegData({ ...regData, password2: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                  {loading ? "Ap kreye kont..." : "Kreye kont mwen"}
                </button>
              </form>
              <div className="role-note">🔒 Tout nouvo kont kreye kòm <b>kont Elèv</b> pa defo.</div>
              <div className="form-foot">
                Ou gen tan gen yon kont? <button className="link-gold" onClick={() => setTab("login")}>Konekte</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
