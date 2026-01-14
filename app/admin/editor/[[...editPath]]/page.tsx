import { PageEditor } from "@components/page/PageEditor";
import { defaultPageData } from "@lib/config/page.config";
import { getPage } from "@lib/db/db-actions";
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
  const data = (await getPage(path)) ?? defaultPageData;

  return <PageEditor path={path} data={data} />;
}
