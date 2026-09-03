// Server Component senp: obligatwa vlope LoginForm (ki itilize
// useSearchParams) nan yon <Suspense> pou 'npm run build' pa echwe
// (Next.js egzije sa pou nenpòt paj ki ka pre-rann estatikman).
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Konstwiavniw — Login / Kreye Kont",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
