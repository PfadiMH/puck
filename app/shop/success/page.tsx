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
      <Suspense>
        <SuccessContent />
      </Suspense>
      <FooterRender data={footerData} />
    </>
  );
}
