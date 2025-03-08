"use server";

import { NavbarData } from "@config/navbar.config";
import { Data } from "@measured/puck";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

interface DatabaseData {
  navbar: NavbarData;
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
  revalidatePath(path);
}

export async function deletePage(path: string) {
  const db = await getDatabase();
  delete db.page[path];
  await fs.writeFile("database.json", JSON.stringify(db));
  revalidatePath(path);
}

export async function getPage(path: string): Promise<Data | undefined> {
  const db = await getDatabase();
  return db.page[path];
}

export async function saveNavbar(data: NavbarData) {
  const db = await getDatabase();
  db.navbar = data;
  await fs.writeFile("database.json", JSON.stringify(db));
  revalidatePath("/", "layout");
}

export async function getNavbar(): Promise<NavbarData | undefined> {
  const db = await getDatabase();
  return db.navbar;
}

export async function saveFooter(data: Data) {
  const db = await getDatabase();
  db.footer = data;
  await fs.writeFile("database.json", JSON.stringify(db));
  revalidatePath("/", "layout");
}

export async function getFooter(): Promise<Data | undefined> {
  const db = await getDatabase();
  return db.footer;
}

export async function getAllPaths() {
  const db = await getDatabase();
  return Object.keys(db.page);
}
