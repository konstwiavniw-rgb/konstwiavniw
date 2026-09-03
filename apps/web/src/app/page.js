import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

export default async function HomePage() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, category, icon")
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  return (
    <>
      <Navbar />

      <header className="hero">
        <div className="wrap hero-inner">
          <span className="eyebrow">Aprann • Kreye • Devlope • Reyisi</span>
          <h1 className="hero-title">
            Konstwi konpetans dijital ou, <em>etap pa etap</em>.
          </h1>
          <p className="hero-sub">
            Konstwiavniw se platfòm ki ede w aprann, kreye, devlope epi monetize yon
            aktivite sou entènèt — ak fòmasyon pratik nan lang ou, Kreyòl Ayisyen.
          </p>
          <div className="hero-row">
            <Link href="/login?tab=register" className="btn btn-primary">Kòmanse kounye a →</Link>
            <a href="#kou" className="btn btn-outline-light">Gade fòmasyon yo</a>
          </div>
          <p className="hero-note">Pa gen okenn eksperyans teknik ki mande. Kòmanse nan nivo ou.</p>

          <div className="steps">
            <div className="step"><span className="num">01</span><span className="label">Aprann</span></div>
            <div className="step"><span className="num">02</span><span className="label">Kreye</span></div>
            <div className="step"><span className="num">03</span><span className="label">Devlope</span></div>
            <div className="step"><span className="num">04</span><span className="label">Reyisi</span></div>
          </div>
        </div>
      </header>

      <section className="pad" id="kou">
        <div className="wrap">
          <span className="section-label">Fòmasyon</span>
          <h2>Premye kou ki disponib yo</h2>
          <p className="lead">Fòmasyon pratik ki pran w soti nan zewo rive nan yon aktivite ki jenere revni.</p>

          {courses && courses.length > 0 ? (
            <div className="cards">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <p className="lead" style={{ color: "var(--muted)" }}>
              Poko gen kou pibliye. Konekte kòm admin pou ajoute premye kou a.
            </p>
          )}
        </div>
      </section>

      <section className="pad bg-off" id="poukisa">
        <div className="wrap">
          <span className="section-label">Diferans lan</span>
          <h2>Poukisa Konstwiavniw?</h2>
          <p className="lead">Nou pa jis anseye teyori — nou pran w pa lamen jiskaske w gen yon rezilta konkrè.</p>
          <div className="why-grid">
            <div className="why-item"><span className="why-num">01</span><h3>100% an Kreyòl</h3><p>Tout kou yo fèt nan lang ou, san barye tradiksyon.</p></div>
            <div className="why-item"><span className="why-num">02</span><h3>Aprantisaj pratik</h3><p>Chak leson mennen nan yon aksyon konkrè, pa jis teyori.</p></div>
            <div className="why-item"><span className="why-num">03</span><h3>Chemen konplè</h3><p>Soti nan aprann yon zouti rive nan monetize l.</p></div>
            <div className="why-item"><span className="why-num">04</span><h3>Aprann nan pwòp rit ou</h3><p>Aksè total sou telefòn, tablet, oswa òdinatè, nenpòt lè.</p></div>
          </div>
        </div>
      </section>

      <section className="pad" id="faq">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="section-label">Kesyon</span>
          <h2>Kesyon Moun Poze Souvan</h2>
          <div style={{ marginTop: 20 }}>
            <details className="faq-item" open>
              <summary className="faq-q">Èske m bezwen eksperyans teknik pou m kòmanse?</summary>
              <div className="faq-a">Non. Kou yo fèt pou moun ki poko gen okenn eksperyans.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">Èske m ka aprann sou telefòn mwen sèlman?</summary>
              <div className="faq-a">Wi. Platfòm nan fèt pou fonksyone byen sou telefòn, tablet, ak òdinatè.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-strip">
            <div><h3>Pare pou w kòmanse konstwi avni ou?</h3><p>Kreye kont ou gratis epi antre nan premye kou a jodi a.</p></div>
            <Link href="/login?tab=register" className="btn btn-primary">Kòmanse kounye a →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
