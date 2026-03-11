"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <nav className="bg-white sticky top-0 z-50 mud-theme">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="font-rockingsoda text-2xl text-contrast-ground">
            Startseite
          </Link>
        </div>
      </nav>
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-contrast-ground">Fehler</h1>
        <p className="text-contrast-ground/70 text-lg">
          Ein Fehler ist aufgetreten
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="bg-primary text-contrast-primary px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="bg-secondary text-contrast-secondary px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </main>
    </>
  );
}
