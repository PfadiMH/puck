import { NavbarEditor } from "@components/navbar/NavbarEditor";
import { getNavbar } from "@lib/db/db-actions";
import { Metadata } from "next";

/**
 * Provide metadata for the Navbar Editor page.
 *
 * @returns The page Metadata object with `title` set to "Navbar Editor".
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Navbar Editor",
  };
}

export default async function Page() {
  const data = await getNavbar();

  return <NavbarEditor data={data} />;
}