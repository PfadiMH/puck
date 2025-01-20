'use server'

import { Data } from "@measured/puck";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

interface DatabaseData {
  navbar: Data;
  page: Record<string, Data>;
  footer: Data;
}

async function getDatabase(): Promise<DatabaseData> {
  const dbFile = await fs.readFile("database.json", "utf-8");
  return JSON.parse(dbFile);
}

export async function savePage(path: string, data: Data) {
  const db = await getDatabase();
  db.page[path] = data;
  await fs.writeFile("database.json", JSON.stringify(db));
  await revalidatePath(path);
}

export async function getPage(path: string): Promise<Data | undefined> {
  const db = await getDatabase();
  return db.page[path];
}

export async function getNavbar(): Promise<Data | undefined> {
  const db = await getDatabase();
  return db.navbar;
}

export async function getFooter(): Promise<Data | undefined> {
  const db = await getDatabase();
  return db.footer;
}
