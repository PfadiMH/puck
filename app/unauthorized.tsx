import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-ground">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-contrast-ground mb-2">
          Nicht angemeldet
        </h2>
        <p className="text-contrast-ground/70 text-lg mb-8">
          Du musst angemeldet sein, um diese Seite zu sehen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-primary text-contrast-primary px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Anmelden
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
