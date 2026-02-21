import { FooterRender } from "@components/footer/FooterRender";
import { NavbarRender } from "@components/navbar/NavbarRender";
import { getFooter, getNavbar } from "@lib/db/db-actions";
import { Suspense } from "react";
import { SuccessContent } from "./SuccessContent";

export default async function ShopSuccessPage() {
  const [navbarData, footerData] = await Promise.all([
    getNavbar(),
    getFooter(),
  ]);

  return (
    <>
      <NavbarRender data={navbarData} />
      <Suspense
        fallback={
          <main className="min-h-[60vh] flex items-center justify-center">
            <div className="text-contrast-ground/40">Laden...</div>
          </main>
        }
      >
        <SuccessContent />
      </Suspense>
      <FooterRender data={footerData} />
    </>
  );
}
