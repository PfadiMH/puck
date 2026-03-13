import { NavbarRender } from "@components/navbar/NavbarRender";
import { FooterRender } from "@components/footer/FooterRender";
import { getFooter, getNavbar } from "@lib/db/db-actions";
import Link from "next/link";

export default async function NotFound() {
  const [navbarData, footerData] = await Promise.all([
    getNavbar(),
    getFooter(),
  ]);

  return (
    <>
      <NavbarRender data={navbarData} />
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-contrast-ground mb-2">
            Seite nicht gefunden
          </h2>
          <p className="text-contrast-ground/70 text-lg mb-8">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-primary text-contrast-primary px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Zur Startseite
            </Link>
            <Link
              href="/admin"
              className="bg-secondary text-contrast-secondary px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Zum Admin-Bereich
            </Link>
          </div>
        </div>
      </main>
      <FooterRender data={footerData} />
    </>
  );
}
