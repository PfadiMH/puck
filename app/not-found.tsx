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
        <h1 className="text-contrast-ground">404</h1>
        <p className="text-contrast-ground/70 text-lg">
          Seite nicht gefunden
        </p>
        <Link
          href="/"
          className="bg-primary text-contrast-primary px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
        >
          Zurück zur Startseite
        </Link>
      </main>
      <FooterRender data={footerData} />
    </>
  );
}
