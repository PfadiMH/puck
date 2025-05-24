import { PageEditor } from "@components/page/PageEditor";
import { defaultPageData } from "@lib/config/page.config";
import { getPageDocument } from "@lib/db/database";
import "@measured/puck/puck.css";
import { Metadata } from "next";

type Params = Promise<{ editPath: string[] }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { editPath = [] } = await params;
  const path = `/${editPath.join("/")}`;

  return {
    title: "Editor: " + path,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { editPath = [] } = await params;
  const path = `/${editPath.join("/")}`;
  let data = (await getPageDocument(path))?.data || defaultPageData;

  return <PageEditor path={path} data={data} />;
}
