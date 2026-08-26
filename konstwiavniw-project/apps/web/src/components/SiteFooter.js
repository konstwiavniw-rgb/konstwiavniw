import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col">
            <Logo light />
            <p style={{ fontSize: ".88rem", maxWidth: 280, color: "#9AA6C0", marginTop: 14 }}>
              Platfòm ki ede w aprann, kreye, devlope epi monetize yon aktivite sou entènèt.
            </p>
          </div>
          <div className="foot-col">
            <h4>Platfòm</h4>
            <a href="#kou">Kou yo</a>
            <a href="#poukisa">Poukisa nou</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="foot-col">
            <h4>Kont</h4>
            <a href="/login">Login</a>
            <a href="/login?tab=register">Kreye kont</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <div className="foot-col">
            <h4>Kontak</h4>
            <a href="#">Sipò</a>
            <a href="#">Kondisyon</a>
            <a href="#">Konfidansyalite</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Konstwiavniw. Tout dwa rezève.</span>
          <span>Aprann • Kreye • Devlope • Reyisi</span>
        </div>
      </div>
    </footer>
  );
}
