import React from "react";
import "@measured/puck/puck.css";
import { NavbarEditor } from "./NavbarEditor";
import { getNavbar, getPage } from "@lib/database";
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
