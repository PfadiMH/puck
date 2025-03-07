import { getFooter } from "@lib/database";
import "@measured/puck/puck.css";
import { Metadata } from "next";
import { FooterEditor } from "./FooterEditor";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Footer Editor",
  };
}

export default async function Page() {
  const data = await getFooter();

  return <FooterEditor data={data} />;
}
