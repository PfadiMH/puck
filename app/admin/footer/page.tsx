import { FooterEditor } from "@components/footer/FooterEditor";
import { getFooter } from "@lib/db/db-actions";
import { Metadata } from "next";

/**
 * Provide metadata for the Footer Editor page.
 *
 * @returns A Metadata object with the page title set to "Footer Editor".
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Footer Editor",
  };
}

export default async function Page() {
  const data = await getFooter();

  return <FooterEditor data={data} />;
}