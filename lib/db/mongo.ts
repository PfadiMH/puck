import { MongoClient, Db } from "mongodb";
import { DatabaseService } from "./database";
import { Data } from "@measured/puck";
import { NavbarData } from "@config/navbar.config";
import { PageData } from "@config/page.config";
import { FooterData } from "@config/footer.config";

/**
 * MongoDB implementation of DatabaseService.
 * Data is stored as documents in a single collection.
 * Each document has a type field to differentiate between navbar, footer, and page data.
 */
export class MongoService implements DatabaseService {
  private client: MongoClient;
  private db: Db;
  private collectionName = "puck-data";

  constructor(connectionString: string, dbName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(dbName);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async savePage(path: string, data: Data): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { type: "page", path: path },
        { $set: { data: data, type: "page", path: path } },
        { upsert: true }
      );
  }

  async deletePage(path: string): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .deleteOne({ type: "page", path: path });
  }

  async getPage(path: string): Promise<PageData | undefined> {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ type: "page", path: path });
    return result ? result.data : undefined;
  }

  async saveNavbar(data: NavbarData): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { type: "navbar" },
        { $set: { data: data, type: "navbar" } },
        { upsert: true }
      );
  }

  async getNavbar(): Promise<NavbarData> {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ type: "navbar" });
    if (!result) throw new Error("Navbar data not found");
    return result.data;
  }

  async saveFooter(data: FooterData): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { type: "footer" },
        { $set: { data: data, type: "footer" } },
        { upsert: true }
      );
  }

  async getFooter(): Promise<FooterData> {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ type: "footer" });
    if (!result) throw new Error("Footer data not found");
    return result.data;
  }

  async getAllPaths(): Promise<string[]> {
    const pages = await this.db
      .collection(this.collectionName)
      .find({ type: "page" })
      .toArray();
    return pages.map((page) => page.path);
  }
}
