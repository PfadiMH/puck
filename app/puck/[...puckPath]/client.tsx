"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import config from "@config/page.config";
import { savePage } from "@lib/database";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <Puck
      config={config}
      data={data}
      onPublish={async (data) => {
        await savePage(path, data);
      }}
    />
  );
}
