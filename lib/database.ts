"use server";

import { NavbarData } from "@config/navbar.config";
import { Data } from "@measured/puck";
import fs from "fs/promises";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { revalidatePath } from "next/cache";

interface DatabaseData {
  navbar: NavbarData;
  page: Record<string, Data>;
  footer: Data;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | any | null = null;

async function getJsonDatabase(): Promise<DatabaseData> {
  const dbFile = await fs.readFile("database.json", "utf-8");
  return JSON.parse(dbFile);
}

async function getDatabase(): Promise<{
  client: MongoClient | null;
  db: Db | any | null;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongodbUri = process.env.MONGODB_URI;

  if (mongodbUri) {
    try {
      const client = new MongoClient(mongodbUri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      await client.connect();
      const dbName = new URL(mongodbUri).pathname.substring(1);
      const db = client.db(dbName);

      cachedClient = client;
      cachedDb = db;

      console.log("Connected to MongoDB");
      return { client, db };
    } catch (e) {
      console.error("Failed to connect to MongoDB, falling back to JSON", e);
      cachedClient = null;
      cachedDb = null;
      const jsonDb = await getJsonDatabase();
      return { client: null, db: jsonDb };
    }
  } else {
    console.log("MONGODB_URI not found, falling back to JSON");
    const jsonDb = await getJsonDatabase();
    return { client: null, db: jsonDb };
  }
}

export async function savePage(path: string, data: Data) {
  const { client, db } = await getDatabase();

  if (client && db) {
    await db
      .collection("pages")
      .updateOne({ path }, { $set: { path, data } }, { upsert: true });
  } else {
    db.page[path] = data;
    await fs.writeFile("database.json", JSON.stringify(db));
  }
  revalidatePath(path);
}

export async function deletePage(path: string) {
  const { client, db } = await getDatabase();
  if (client && db) {
    await db.collection("pages").deleteOne({ path });
  } else {
    delete db.page[path];
    await fs.writeFile("database.json", JSON.stringify(db));
  }
  revalidatePath(path);
}

export async function getPage(path: string): Promise<Data | undefined> {
  const { client, db } = await getDatabase();
  if (client && db) {
    const page = await db.collection("pages").findOne({ path });
    return page ? page.data : undefined;
  } else {
    return db.page[path];
  }
}

export async function saveNavbar(data: NavbarData) {
  const { client, db } = await getDatabase();
  if (client && db) {
    await db
      .collection("navbar")
      .updateOne({}, { $set: { data } }, { upsert: true });
  } else {
    db.navbar = data;
    await fs.writeFile("database.json", JSON.stringify(db));
  }
  revalidatePath("/", "layout");
}

export async function getNavbar(): Promise<NavbarData | undefined> {
  const { client, db } = await getDatabase();
  if (client && db) {
    const navbar = await db.collection("navbar").findOne({});
    return navbar ? navbar.data : undefined;
  } else {
    return db.navbar;
  }
}

export async function saveFooter(data: Data) {
  const { client, db } = await getDatabase();
  if (client && db) {
    await db
      .collection("footer")
      .updateOne({}, { $set: { data } }, { upsert: true });
  } else {
    db.footer = data;
    await fs.writeFile("database.json", JSON.stringify(db));
  }
  revalidatePath("/", "layout");
}

export async function getFooter(): Promise<Data | undefined> {
  const { client, db } = await getDatabase();
  if (client && db) {
    const footer = await db.collection("footer").findOne({});
    return footer ? footer.data : undefined;
  } else {
    return db.footer;
  }
}

export async function getAllPaths() {
  const { client, db } = await getDatabase();
  if (client && db) {
    const pages = await db.collection("pages").find({}).toArray();
    return pages.map((page: any) => page.path);
  } else {
    return Object.keys(db.page);
  }
}
