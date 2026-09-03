# KONSTWIAVNIW

**Aprann • Kreye • Devlope • Reyisi**

Platfòm edikasyonèl sou entènèt ki ede moun aprann konpetans dijital pou yo
kreye, devlope epi monetize yon aktivite sou entènèt.

Sa a se **Vèsyon 1 — Aplikasyon Reyèl** (Next.js + Supabase), pa yon prototip
HTML ankò. Home Page, Login/Register, Student Dashboard ak Admin Dashboard
fonksyone ansanm ak vre baz done a. Peman, afilyasyon, komisyon, kominote,
abònman ak app mobil poko ladan l — estrikti a fèt pou akeyi yo pita.

---

## 1. Stack Teknik

- **Next.js 14** (App Router, JavaScript) — Server Components + Server Actions
- **Supabase** — PostgreSQL, Auth, Row Level Security
- **CSS** — design system Konstwiavniw (navy/blan/lò) kòm CSS global, san lib eksteryè

## 2. Estrikti Pwojè a

```
konstwiavniw/
├── apps/web/                          ← APLIKASYON NEXT.JS LA
│   ├── package.json
│   ├── next.config.mjs
│   ├── .env.local.example             ← kopye rename l .env.local
│   └── src/
│       ├── app/
│       │   ├── layout.js              ← polis + globals.css
│       │   ├── page.js                ← HOME PAGE (li kou pibliye nan Supabase)
│       │   ├── globals.css
│       │   ├── login/page.js          ← LOGIN/REGISTER (Supabase Auth)
│       │   ├── dashboard/
│       │   │   ├── page.js            ← STUDENT DASHBOARD
│       │   │   └── actions.js         ← Server Action: make leson fini
│       │   └── admin/
│       │       ├── page.js            ← ADMIN DASHBOARD
│       │       └── actions.js         ← Server Actions: kreye/efase kou, modil, leson
│       ├── components/                ← Navbar, Logo, CourseCard, DashboardShell...
│       ├── lib/
│       │   ├── auth.js                ← signUp/signIn/signOut (browser)
│       │   └── supabase/
│       │       ├── client.js          ← kliyan navigatè
│       │       └── server.js          ← kliyan sèvè (Server Components/Actions)
│       ├── middleware.js              ← pwoteje /dashboard ak /admin
│       └── styles/
│           ├── tokens.css             ← koulè, polis (san chanjman)
│           └── components.css         ← klas reyitilizab (bouton, kad, sidebar...)
├── database/migrations/               ← 3 fichye SQL (deja prepare, san chanjman)
└── docs/
    ├── database-guide.md
    └── legacy-html-prototypes/         ← ansyen prototip HTML (referans sèlman)
```

## 3. Kijan Chak Bagay Konekte

- **Middleware** (`src/middleware.js`) verifye sesyon Supabase la sou CHAK
  rekèt `/dashboard/*` ak `/admin/*`: si pa gen sesyon → `/login`; si se yon
  elèv ki eseye antre `/admin` → voye l tounen `/dashboard`.
- **Login/Register** rele `signUp`/`signIn` (Supabase Auth), epi apre sa li
  chèche wòl itilizatè a (`profiles.role`) pou l voye l nan bon dashboard la.
- **Student Dashboard** ak **Admin Dashboard** se **Server Components**: yo li
  done yo dirèkteman nan Supabase (avèk sesyon itilizatè a) anvan yo voye HTML
  la bay navigatè a — pa gen "loading spinner" ki mande.
- **Server Actions** (`actions.js` nan `dashboard/` ak `admin/`) se fonksyon ki
  egzekite SOU SÈVÈ a lè yon fòm soumèt (kreye kou, ajoute modil/leson, make
  leson fini, efase resous). Yo verifye wòl la anvan, epi Row Level Security
  nan baz done a aji kòm dezyèm liy defans.

## 4. Sa ki SENPLIFYE pou kounye a (pou n pa depase sa ou mande)

- Videyo/PDF: admin antre yon **lyen (URL)** pou kounye a, olye yon vrè
  telechajman fichye. Telechajman reyèl (Supabase Storage) se yon ekstansyon
  klè pou pwochen etap — estrikti tab `resources`/`lessons` deja pare pou l.
- Imèl elèv yo pa afiche nan tablo Admin "Elèv" (Supabase pa ekspoze imèl
  itilizatè atravè `profiles` pou rezon sekirite/RLS); pou wè yo, sèvi ak
  Supabase Dashboard > Authentication, oswa ajoute yon fonksyon sèvè adisyonèl
  pita si sa nesesè.

## 5. Etap pou Fè l Fonksyone Lokalman

```bash
cd apps/web
npm install
cp .env.local.example .env.local   # mete SUPABASE_URL ak ANON_KEY ou
npm run dev                        # http://localhost:3000
```

Anvan sa, egzekite 3 migration yo **nan lòd** nan SQL Editor Supabase ou a:
`001_profiles_roles.sql` → `002_courses_content.sql` → `003_enrollments_progress.sql`

## 6. Etap pou Mete l ONLINE

1. **Kreye pwojè Supabase** (si poko fèt) sou supabase.com →
   kopye `Project URL` ak `anon public key` (Settings > API).
2. **Egzekite migrations yo** nan SQL Editor Supabase la, nan lòd (`001`, `002`, `003`).
3. **Pouse kòd la sou GitHub** (kreye yon repo, `git init`, `git add .`, `git commit`, `git push`).
4. **Konekte repo a ak Vercel** (vercel.com → "New Project" → chwazi repo a).
   - Root Directory: `apps/web`
   - Framework: Next.js (detekte otomatikman)
5. **Ajoute varyab anviwònman yo** nan Vercel (Settings > Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. **Deplwaye** — Vercel bay ou yon URL (`konstwiavniw.vercel.app`).
7. **Kreye premye kont Admin ou :** kreye kont ou nòmalman sou sit la
   (kòm elèv pa defo), epi nan SQL Editor Supabase la, egzekite:
   ```sql
   update public.profiles set role = 'admin' where id = '<UUID_ou>';
   ```
   (Ou jwenn UUID a nan Authentication > Users.)
8. **(Opsyonèl)** Ajoute yon non domèn pèsonalize (`konstwiavniw.com`) nan
   paramèt Vercel Project > Domains.

## 7. Sa ki PA nan Vèsyon 1 (entansyonèl)

Peman, Komisyon, Afilyasyon, Kominote, Abònman, Aplikasyon Mobil — yo vini
nan pwochen vèsyon yo, san yo pa oblije kraze oswa refè sa ki la deja.
