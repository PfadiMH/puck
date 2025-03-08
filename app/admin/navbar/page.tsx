import { getNavbar } from "@lib/database";
import "@measured/puck/puck.css";
import { Metadata } from "next";
import { NavbarEditor } from "./NavbarEditor";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Navbar Editor",
  };
}

export default async function Page() {
  const data = (await getNavbar()) ?? {
    root: { props: { logo: undefined } },
    content: [],
  };
  return <NavbarEditor data={data} />;
}
