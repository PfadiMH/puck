import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-ground">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-contrast-ground mb-2">
          Zugriff verweigert
        </h2>
        <p className="text-contrast-ground/70 text-lg mb-8">
          Du hast keine Berechtigung, diese Seite zu sehen. Wende dich an einen
          Administrator, wenn du glaubst, dass das ein Fehler ist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin"
            className="bg-primary text-contrast-primary px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Zum Admin-Bereich
          </Link>
          <Link
            href="/"
            className="bg-secondary text-contrast-secondary px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
