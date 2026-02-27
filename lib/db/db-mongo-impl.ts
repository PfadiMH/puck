import type {
  CalendarEvent,
  CalendarEventDb,
  CalendarEventInput,
  CalendarGroup,
  CalendarGroupDb,
  CalendarGroupInput,
} from "@lib/calendar/types";
import { defaultFooterData, FooterData } from "@lib/config/footer.config";
import { defaultNavbarData, NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import type { OrganigrammCache } from "@lib/hitobito/types";
import {
  defaultSecurityConfig,
  SecurityConfig,
} from "@lib/security/security-config";
import type {
  Product,
  ProductDb,
  ProductInput,
  ShopSettings,
} from "@lib/shop/types";
import { defaultShopSettings } from "@lib/shop/types";
import type {
  FileRecord,
  FileRecordDb,
  FileRecordInput,
} from "@lib/storage/file-record";
import { Data } from "@puckeditor/core";
import { Db, Filter, MongoClient } from "mongodb";
import { DatabaseService, FileQueryOptions, FileQueryResult } from "./db";

/**
 * MongoDB implementation of DatabaseService.
 * Data is stored as documents in a single collection.
 * Each document has a type field to differentiate between navbar, footer, and page data.
 */
export class MongoService implements DatabaseService {
  private client: MongoClient;
  private db: Db;
  private puckDataCollectionName = "puck-data";
  private securityCollectionName = "security";
  private filesCollectionName = "files";
  private productsCollectionName = "products";
  private shopSettingsCollectionName = "shop-settings";
  private processedSessionsCollectionName = "processed_sessions";
  private hitobitoCollectionName = "hitobito-cache";
  private calendarGroupsCollectionName = "calendar-groups";
  private calendarEventsCollectionName = "calendar-events";
  private initPromise: Promise<void>;

  constructor(connectionString: string, dbName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(dbName);
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    // Ensure collection exists
    const collections = await this.db
      .listCollections({ name: this.puckDataCollectionName })
      .toArray();
    if (collections.length === 0) {
      await this.db.createCollection(this.puckDataCollectionName);
      await this.db
        .collection(this.puckDataCollectionName)
        .createIndex({ path: 1 });
    }

    // Ensure navbar exists
    const navbar = await this.db
      .collection(this.puckDataCollectionName)
      .findOne({ type: "navbar" });
    if (!navbar) {
      console.log("Navbar data not found, creating with default data");
      await this.saveNavbar(defaultNavbarData);
    }

    // Ensure footer exists
    const footer = await this.db
      .collection(this.puckDataCollectionName)
      .findOne({ type: "footer" });
    if (!footer) {
      console.log("Footer data not found, creating with default data");
      await this.saveFooter(defaultFooterData);
    }

    // Ensure Security Config exists
    const securityConfig = await this.db
      .collection(this.securityCollectionName)
      .findOne({ type: "securityConfig" });
    if (!securityConfig) {
      console.log("Security Config not found, creating with default data");
      await this.saveSecurityConfig(defaultSecurityConfig);
    }

    // Ensure files collection has indexes
    const filesCollections = await this.db
      .listCollections({ name: this.filesCollectionName })
      .toArray();
    if (filesCollections.length === 0) {
      await this.db.createCollection(this.filesCollectionName);
    }
    // Create indexes for file queries (idempotent)
    const filesCollection = this.db.collection(this.filesCollectionName);
    await filesCollection.createIndex({ createdAt: -1 });
    await filesCollection.createIndex({ folder: 1 });
    await filesCollection.createIndex({ tags: 1 });

    // Ensure products collection has indexes
    const productsCollections = await this.db
      .listCollections({ name: this.productsCollectionName })
      .toArray();
    if (productsCollections.length === 0) {
      await this.db.createCollection(this.productsCollectionName);
    }
    const productsCollection = this.db.collection(this.productsCollectionName);
    await productsCollection.createIndex({ active: 1 });
    await productsCollection.createIndex({ createdAt: -1 });

    // Ensure processed_sessions collection with TTL index (auto-cleanup after 72h)
    const psCollections = await this.db
      .listCollections({ name: this.processedSessionsCollectionName })
      .toArray();
    if (psCollections.length === 0) {
      await this.db.createCollection(this.processedSessionsCollectionName);
    }
    const psCollection = this.db.collection(
      this.processedSessionsCollectionName
    );
    await psCollection.createIndex({ sessionId: 1 }, { unique: true });
    await psCollection.createIndex(
      { processedAt: 1 },
      { expireAfterSeconds: 72 * 60 * 60 }
    );

    // Ensure hitobito-cache collection has indexes
    const hitobitoCollections = await this.db
      .listCollections({ name: this.hitobitoCollectionName })
      .toArray();
    if (hitobitoCollections.length === 0) {
      await this.db.createCollection(this.hitobitoCollectionName);
    }
    await this.db
      .collection(this.hitobitoCollectionName)
      .createIndex({ rootGroupId: 1 }, { unique: true });

    // Ensure calendar-groups collection has indexes
    const calGroupCollections = await this.db
      .listCollections({ name: this.calendarGroupsCollectionName })
      .toArray();
    if (calGroupCollections.length === 0) {
      await this.db.createCollection(this.calendarGroupsCollectionName);
    }
    const calGroupCol = this.db.collection(this.calendarGroupsCollectionName);
    await calGroupCol.createIndex({ slug: 1 }, { unique: true });
    await calGroupCol.createIndex({ order: 1 });

    // Ensure calendar-events collection has indexes
    const calEventCollections = await this.db
      .listCollections({ name: this.calendarEventsCollectionName })
      .toArray();
    if (calEventCollections.length === 0) {
      await this.db.createCollection(this.calendarEventsCollectionName);
    }
    const calEventCol = this.db.collection(this.calendarEventsCollectionName);
    await calEventCol.createIndex({ groups: 1 });
    await calEventCol.createIndex({ date: 1, startTime: 1 });
    await calEventCol.createIndex({ allGroups: 1 });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    // Wait for initialization to complete before closing
    await this.initPromise;
    await this.client.close();
  }

  async savePage(path: string, data: Data): Promise<void> {
    await this.db
      .collection(this.puckDataCollectionName)
      .updateOne(
        { type: "page", path: path },
        { $set: { data: data, type: "page", path: path } },
        { upsert: true }
      );
  }

  async deletePage(path: string): Promise<void> {
    await this.db
      .collection(this.puckDataCollectionName)
      .deleteOne({ type: "page", path: path });
  }

  async getPage(path: string): Promise<PageData | undefined> {
    const result = await this.db
      .collection(this.puckDataCollectionName)
      .findOne({ type: "page", path: path });
    return result ? result.data : undefined;
  }

  async saveNavbar(data: NavbarData): Promise<void> {
    await this.db
      .collection(this.puckDataCollectionName)
      .updateOne(
        { type: "navbar" },
        { $set: { data: data, type: "navbar" } },
        { upsert: true }
      );
  }

  async getNavbar(): Promise<NavbarData> {
    const result = await this.db
      .collection(this.puckDataCollectionName)
      .findOne({ type: "navbar" });
    if (!result) throw new Error("Navbar data not found");
    return result.data;
  }

  async saveFooter(data: FooterData): Promise<void> {
    await this.db
      .collection(this.puckDataCollectionName)
      .updateOne(
        { type: "footer" },
        { $set: { data: data, type: "footer" } },
        { upsert: true }
      );
  }

  async getFooter(): Promise<FooterData> {
    const result = await this.db
      .collection(this.puckDataCollectionName)
      .findOne({ type: "footer" });
    if (!result) throw new Error("Footer data not found");
    return result.data;
  }

  async getAllPaths(): Promise<string[]> {
    const pages = await this.db
      .collection(this.puckDataCollectionName)
      .find({ type: "page" })
      .toArray();
    return pages.map((page) => page.path);
  }

  async getSecurityConfig(): Promise<SecurityConfig> {
    const result = await this.db
      .collection(this.securityCollectionName)
      .findOne({ type: "securityConfig" });
    if (!result) return defaultSecurityConfig;
    return result.data;
  }

  async saveSecurityConfig(securityConfig: SecurityConfig): Promise<void> {
    await this.db
      .collection(this.securityCollectionName)
      .updateOne(
        { type: "securityConfig" },
        { $set: { data: securityConfig, type: "securityConfig" } },
        { upsert: true }
      );
  }

  async saveFile(file: FileRecordInput): Promise<FileRecord> {
    const record: FileRecordDb = {
      ...file,
      _id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .insertOne(record);
    return {
      ...record,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async getFile(id: string): Promise<FileRecord | null> {
    const result = await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .findOne({ _id: id } as Partial<FileRecordDb>);
    if (!result) return null;
    return { ...result, createdAt: result.createdAt.toISOString() };
  }

  async getAllFiles(): Promise<FileRecord[]> {
    const results = await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return results.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async deleteFile(id: string): Promise<void> {
    await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .deleteOne({ _id: id } as Partial<FileRecordDb>);
  }

  async updateFile(
    id: string,
    updates: { folder?: string; tags?: string[] }
  ): Promise<FileRecord | null> {
    const result = await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .findOneAndUpdate(
        { _id: id } as Partial<FileRecordDb>,
        { $set: updates },
        { returnDocument: "after" }
      );

    if (!result) return null;
    return { ...result, createdAt: result.createdAt.toISOString() };
  }

  async getAllFolders(): Promise<string[]> {
    const folders = await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .distinct("folder");

    // Always include root, filter nulls, sort
    const validFolders = folders.filter((f): f is string => typeof f === "string" && f.length > 0);
    const folderSet = new Set<string>(["/", ...validFolders]);
    return [...folderSet].sort();
  }

  private buildFileFilter(options: Omit<FileQueryOptions, "limit" | "cursor">): Filter<FileRecordDb> {
    const filter: Filter<FileRecordDb> = {};

    if (options.folder && options.folder !== "/") {
      filter.folder = options.folder;
    }

    if (options.search) {
      // Search in filename and tags
      filter.$or = [
        { filename: { $regex: options.search, $options: "i" } },
        { tags: { $regex: options.search, $options: "i" } },
      ];
    }

    if (options.tags && options.tags.length > 0) {
      filter.tags = { $in: options.tags };
    }

    return filter;
  }

  async queryFiles(options: FileQueryOptions): Promise<FileQueryResult> {
    const limit = options.limit || 50;
    const baseFilter = this.buildFileFilter(options);

    // Get total count (without cursor filter)
    const total = await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .countDocuments(baseFilter);

    // Build final filter with cursor pagination if needed
    let finalFilter: Filter<FileRecordDb> = baseFilter;

    if (options.cursor) {
      const cursorDoc = await this.db
        .collection<FileRecordDb>(this.filesCollectionName)
        .findOne({ _id: options.cursor } as Partial<FileRecordDb>);

      if (cursorDoc) {
        // Cursor filter: get items after the cursor (sorted by createdAt desc, _id desc)
        const cursorFilter: Filter<FileRecordDb> = {
          $or: [
            { createdAt: { $lt: cursorDoc.createdAt } },
            {
              createdAt: cursorDoc.createdAt,
              _id: { $lt: options.cursor },
            },
          ],
        } as Filter<FileRecordDb>;

        // Combine base filter with cursor filter using $and
        // This ensures both conditions are met without mutating the original filter
        finalFilter =
          Object.keys(baseFilter).length > 0
            ? { $and: [baseFilter, cursorFilter] }
            : cursorFilter;
      }
    }

    const results = await this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .find(finalFilter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1) // Fetch one extra to check if there are more
      .toArray();

    const hasMore = results.length > limit;
    const files = results.slice(0, limit);
    const nextCursor = hasMore && files.length > 0 ? files[files.length - 1]._id : null;

    return {
      files: files.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      nextCursor,
      total,
    };
  }

  async countFiles(options: Omit<FileQueryOptions, "limit" | "cursor">): Promise<number> {
    const filter = this.buildFileFilter(options);
    return this.db
      .collection<FileRecordDb>(this.filesCollectionName)
      .countDocuments(filter);
  }

  // --- Shop ---

  private productCol() {
    return this.db.collection<ProductDb>(this.productsCollectionName);
  }

  private toProduct(r: ProductDb): Product {
    return {
      _id: r._id,
      name: r.name,
      description: r.description,
      images: r.images,
      price: r.price,
      options: r.options,
      variants: r.variants,
      active: r.active,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async getProducts(): Promise<Product[]> {
    const results = await this.productCol()
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return results.map((r) => this.toProduct(r));
  }

  async getActiveProducts(): Promise<Product[]> {
    const results = await this.productCol()
      .find({ active: true })
      .sort({ createdAt: -1 })
      .toArray();
    return results.map((r) => this.toProduct(r));
  }

  async getProduct(id: string): Promise<Product | null> {
    const result = await this.productCol().findOne({
      _id: id,
    } as Partial<ProductDb>);
    if (!result) return null;
    return this.toProduct(result);
  }

  async saveProduct(product: ProductInput): Promise<Product> {
    const now = new Date().toISOString();
    const doc: ProductDb = {
      _id: crypto.randomUUID(),
      ...product,
      createdAt: now,
      updatedAt: now,
    };
    await this.productCol().insertOne(doc);
    return this.toProduct(doc);
  }

  async updateProduct(id: string, product: ProductInput): Promise<Product | null> {
    const now = new Date().toISOString();
    const result = await this.productCol().findOneAndUpdate(
      { _id: id } as Partial<ProductDb>,
      {
        $set: {
          ...product,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );
    if (!result) return null;
    return this.toProduct(result);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productCol().deleteOne({ _id: id } as Partial<ProductDb>);
  }

  async getShopSettings(): Promise<ShopSettings> {
    const result = await this.db
      .collection(this.shopSettingsCollectionName)
      .findOne({ type: "shopSettings" });
    if (!result) return defaultShopSettings;
    return result.data;
  }

  async saveShopSettings(settings: ShopSettings): Promise<void> {
    await this.db
      .collection(this.shopSettingsCollectionName)
      .updateOne(
        { type: "shopSettings" },
        { $set: { data: settings, type: "shopSettings" } },
        { upsert: true }
      );
  }

  async decrementStock(
    productId: string,
    variantIndex: number,
    quantity: number
  ): Promise<boolean> {
    const result = await this.productCol().updateOne(
      {
        _id: productId,
        [`variants.${variantIndex}.stock`]: { $gte: quantity },
      } as Partial<ProductDb>,
      {
        $inc: { [`variants.${variantIndex}.stock`]: -quantity },
      }
    );
    return result.modifiedCount === 1;
  }

  async isSessionProcessed(sessionId: string): Promise<boolean> {
    const doc = await this.db
      .collection(this.processedSessionsCollectionName)
      .findOne({ sessionId });
    return !!doc;
  }

  async markSessionProcessed(sessionId: string): Promise<void> {
    await this.db
      .collection(this.processedSessionsCollectionName)
      .updateOne(
        { sessionId },
        { $setOnInsert: { sessionId, processedAt: new Date() } },
        { upsert: true }
      );
  }

  // --- Hitobito Organigramm cache ---

  async getOrganigrammCache(
    rootGroupId: number
  ): Promise<OrganigrammCache | null> {
    const result = await this.db
      .collection(this.hitobitoCollectionName)
      .findOne({ rootGroupId });
    if (!result) return null;
    return {
      rootGroupId: result.rootGroupId,
      fetchedAt: result.fetchedAt,
      data: result.data,
    };
  }

  async saveOrganigrammCache(cache: OrganigrammCache): Promise<void> {
    await this.db
      .collection(this.hitobitoCollectionName)
      .updateOne(
        { rootGroupId: cache.rootGroupId },
        {
          $set: {
            rootGroupId: cache.rootGroupId,
            fetchedAt: cache.fetchedAt,
            data: cache.data,
          },
        },
        { upsert: true }
      );
  }

  // --- Calendar ---

  private calendarGroupCol() {
    return this.db.collection<CalendarGroupDb>(
      this.calendarGroupsCollectionName
    );
  }

  private calendarEventCol() {
    return this.db.collection<CalendarEventDb>(
      this.calendarEventsCollectionName
    );
  }

  async getCalendarGroups(): Promise<CalendarGroup[]> {
    return this.calendarGroupCol().find().sort({ order: 1 }).toArray();
  }

  async getCalendarGroup(id: string): Promise<CalendarGroup | null> {
    return this.calendarGroupCol().findOne({
      _id: id,
    } as Partial<CalendarGroupDb>);
  }

  async saveCalendarGroup(
    group: CalendarGroupInput
  ): Promise<CalendarGroup> {
    const doc: CalendarGroupDb = {
      _id: crypto.randomUUID(),
      ...group,
    };
    await this.calendarGroupCol().insertOne(doc);
    return doc;
  }

  async updateCalendarGroup(
    id: string,
    group: CalendarGroupInput
  ): Promise<CalendarGroup | null> {
    const result = await this.calendarGroupCol().findOneAndUpdate(
      { _id: id } as Partial<CalendarGroupDb>,
      { $set: { ...group } },
      { returnDocument: "after" }
    );
    return result ?? null;
  }

  async deleteCalendarGroup(id: string): Promise<void> {
    await this.calendarGroupCol().deleteOne({
      _id: id,
    } as Partial<CalendarGroupDb>);
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return this.calendarEventCol()
      .find()
      .sort({ date: 1, startTime: 1 })
      .toArray();
  }

  async getCalendarEvent(id: string): Promise<CalendarEvent | null> {
    return this.calendarEventCol().findOne({
      _id: id,
    } as Partial<CalendarEventDb>);
  }

  async getEventsByGroup(groupSlug: string): Promise<CalendarEvent[]> {
    return this.calendarEventCol()
      .find({
        $or: [
          { groups: groupSlug },
          { allGroups: true },
        ],
      } as Filter<CalendarEventDb>)
      .sort({ date: 1, startTime: 1 })
      .toArray();
  }

  async getNextUpcomingEvent(
    groupSlug: string
  ): Promise<CalendarEvent | null> {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const result = await this.calendarEventCol()
      .find({
        $and: [
          { date: { $gte: todayStr } },
          {
            $or: [
              { groups: groupSlug },
              { allGroups: true },
            ],
          },
        ],
      } as Filter<CalendarEventDb>)
      .sort({ date: 1, startTime: 1 })
      .limit(1)
      .toArray();
    return result[0] ?? null;
  }

  async getAllUpcomingEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return this.calendarEventCol()
      .find({ date: { $gte: todayStr } } as Filter<CalendarEventDb>)
      .sort({ date: 1, startTime: 1 })
      .toArray();
  }

  async saveCalendarEvent(
    event: CalendarEventInput
  ): Promise<CalendarEvent> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const doc: CalendarEventDb = {
      _id: id,
      uid: `event-${id}@pfadimh.ch`,
      ...event,
      createdAt: now,
      updatedAt: now,
    };
    await this.calendarEventCol().insertOne(doc);
    return doc;
  }

  async updateCalendarEvent(
    id: string,
    event: CalendarEventInput
  ): Promise<CalendarEvent | null> {
    const now = new Date().toISOString();
    const result = await this.calendarEventCol().findOneAndUpdate(
      { _id: id } as Partial<CalendarEventDb>,
      {
        $set: {
          ...event,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );
    return result ?? null;
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    await this.calendarEventCol().deleteOne({
      _id: id,
    } as Partial<CalendarEventDb>);
  }
}
