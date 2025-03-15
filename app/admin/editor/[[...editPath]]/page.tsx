import React from "react";
import "@measured/puck/puck.css";
import { PageEditor } from "./PageEditor";
import { getPage } from "@lib/db/database";
import { Metadata } from "next";
import { defaultPageData } from "@config/page.config";

export async function generateMetadata({
  params: { editPath = [] },
}: {
  params: { editPath: string[] };
}): Promise<Metadata> {
  const path = `/${editPath.join("/")}`;

  return {
    title: "Editor: " + path,
  };
}

export default async function Page({
  params: { editPath = [] },
}: {
  params: { editPath: string[] };
}) {
  const path = `/${editPath.join("/")}`;
  const data = await getPage(path) ?? defaultPageData;

  return <PageEditor path={path} data={data} />;
}

export const dynamic = "force-dynamic";
