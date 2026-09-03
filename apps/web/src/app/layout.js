import "./globals.css";

export const metadata = {
  title: "Konstwiavniw — Aprann • Kreye • Devlope • Reyisi",
  description:
    "Platfòm ki ede w aprann, kreye, devlope epi monetize yon aktivite sou entènèt.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ht">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
