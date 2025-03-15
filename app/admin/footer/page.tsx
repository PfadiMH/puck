import React from "react";
import "@measured/puck/puck.css";
import { FooterEditor } from "./FooterEditor";
import { getFooter } from "@lib/db/database";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Footer Editor",
  };
}

export default async function Page() {
  const data = await getFooter();

  return <FooterEditor data={data} />;
}
