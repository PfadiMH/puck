import { FooterEditor } from "@components/footer/FooterEditor";
import { getFooter } from "@lib/db/db-actions";
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
