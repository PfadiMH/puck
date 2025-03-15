import { defaultPageData } from "@config/page.config";
import { getPage } from "@lib/db/database";
import "@measured/puck/puck.css";
import { Metadata } from "next";
import { PageEditor } from "./PageEditor";

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

export const dynamic = "force-dynamic";
