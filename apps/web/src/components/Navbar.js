import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="nav-mock">
      <div className="wrap nav-inner">
        <Logo />
        <div className="nav-links">
          <a href="#kou">Kou yo</a>
          <a href="#poukisa">Poukisa nou</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-cta">
          <Link href="/login" className="btn-ghost">Login</Link>
          <Link href="/login?tab=register" className="btn btn-primary btn-sm">Kreye kont</Link>
        </div>
      </div>
    </nav>
  );
}
