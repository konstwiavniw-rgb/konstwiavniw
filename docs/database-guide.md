# Baz Done Konstwiavniw — Estrikti ak Koneksyon ak Sit la

## 1. Karant tab yo (rezime)

```
profiles          — pwofil itilizatè (wòl: student | admin)
courses           — kou yo
modules           — modil anndan yon kou
lessons           — leson anndan yon modil (videyo/pdf/tèks)
resources         — fichye pou telechaje (lye a yon leson OSWA yon kou)
enrollments       — ki elèv ki enskri nan ki kou
lesson_progress   — ki leson yon elèv fin fè
course_progress   — VI (view) ki kalkile % otomatikman
```

**Relasyon yo :**
```
courses (1) ─── (N) modules ─── (N) lessons ─── (N) resources
   │                                   │
   │                                   └─ (N) lesson_progress ── (1) profiles
   └─ (N) enrollments ── (1) profiles
```

## 2. Kijan chak paj sit la pral itilize baz done a

| Paj (deja kreye)        | Sa li li nan baz done a                                                              | Sa li ekri |
|--------------------------|---------------------------------------------------------------------------------------|------------|
| **Home Page**            | `courses` (kote `is_published = true`) pou afiche lis kou yo                          | — |
| **Login/Register**       | `auth.users` (Supabase Auth) + `profiles` (kreye otomatikman ak *trigger*)             | Yon nouvo `profiles` ranje |
| **Student Dashboard**    | `enrollments` (kou li), `course_progress` (% pwogrè), `lessons` (pwochen leson), `resources` | `lesson_progress` (chak fwa li fini yon leson) |
| **Admin Dashboard**      | `profiles`, `courses`, `modules`, `lessons`, `resources`, `enrollments`, `lesson_progress` (pou estatistik) | `courses`, `modules`, `lessons`, `resources` (kreye/modifye/efase) |

## 3. Poukisa yon elèv PAT ka wè done lòt elèv

Chak règ RLS (Row Level Security) mete nan baz done a **mande** `auth.uid() = user_id` anvan li kite yon *select/insert/update*. Sa vle di:

- Menm si yon moun ta eseye chanje kòd frontend lan pou mande done yon lòt elèv, Postgres li menm — pa kòd sit la — ap refize l. Sekirite a rete la menm si gen yon erè nan frontend lan.
- Elèv la ka **li ak modifye SÈLMAN** pwòp `enrollments` ak `lesson_progress` li.
- Admin ka **li** tout `enrollments`/`lesson_progress` (pou estatistik ak jesyon elèv), men li **pa gen dwa modifye pwogrè yon elèv** — sa rete yon dwa ki apatyen a elèv la sèlman.
- Admin se sèl wòl ki gen dwa kreye/modifye/efase `courses`, `modules`, `lessons`, `resources`.

## 4. Pwochen etap teknik (lè n pare pou konekte pou vre)

1. Kreye pwojè a sou [supabase.com](https://supabase.com), kopye `SUPABASE_URL` ak `ANON_KEY` nan `.env.local`.
2. Egzekite 3 fichye migration yo **nan lòd** nan SQL Editor Supabase la:
   `001_profiles_roles.sql` → `002_courses_content.sql` → `003_enrollments_progress.sql`
3. Ranplase `console.log(...)` plasholdè nan paj Login/Register ak Student/Admin Dashboard yo pa vre apèl `lib/auth.js` ak Supabase client (`lib/supabaseClient.js`) — estrikti a deja prepare pou sa.
4. Pou premye admin ou, kreye kont ou nòmalman, epi chanje wòl li manyèlman nan SQL:
   `update public.profiles set role = 'admin' where id = '...';`

## 5. Sa nou PA t' touche (jan ou mande)

Peman, komisyon, afilyasyon, abònman, ak aplikasyon mobil — baz sa a fèt yon fason ki pral pèmèt nou ajoute yo pita san n pa oblije refè tab ki egziste yo (pa egzanp: yon tab `payments` ki lye ak `enrollments` ta ka ajoute san chanje anyen nan sa ki la deja).
