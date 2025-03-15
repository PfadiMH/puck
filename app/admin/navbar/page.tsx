import "@measured/puck/puck.css";
import { NavbarEditor } from "./NavbarEditor";
import { getNavbar } from "@lib/db/database";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Navbar Editor",
  };
}

export default async function Page() {
  const data = await getNavbar();

  return <NavbarEditor data={data} />;
}
