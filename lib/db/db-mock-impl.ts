import type {
  CalendarEvent,
  CalendarEventDb,
  CalendarEventInput,
  CalendarGroup,
  CalendarGroupDb,
  CalendarGroupInput,
} from "@lib/calendar/types";
import { defaultFooterData } from "@lib/config/footer.config";
import { defaultNavbarData } from "@lib/config/navbar.config";
import type { OrganigrammCache } from "@lib/hitobito/types";
import { defaultSecurityConfig } from "@lib/security/security-config";
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
import type { DatabaseService, FileQueryOptions, FileQueryResult } from "./db";

/** Returns today's date string (YYYY-MM-DD) in Europe/Zurich timezone. */
function getZurichDateString(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${year}-${month}-${day}`;
}

/** Returns the current time string (HH:MM) in Europe/Zurich timezone. */
function getZurichTimeString(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")!.value;
  const minute = parts.find((p) => p.type === "minute")!.value;
  return `${hour}:${minute}`;
}

export class MockDatabaseService implements DatabaseService {
  private files: FileRecordDb[] = [];
  private products: ProductDb[] = [];
  private shopSettings: ShopSettings = { ...defaultShopSettings };

  async savePage() {}
  async deletePage() {}
  async getPage() {
    return undefined;
  }
  async saveNavbar() {}
  async getNavbar() {
    return defaultNavbarData;
  }
  async saveFooter() {}
  async getFooter() {
    return defaultFooterData;
  }
  async getAllPaths() {
    return [];
  }
  async getSecurityConfig() {
    return defaultSecurityConfig;
  }
  async saveSecurityConfig() {}

  async saveFile(file: FileRecordInput): Promise<FileRecord> {
    const record: FileRecordDb = {
      ...file,
      _id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.files.push(record);
    return { ...record, createdAt: record.createdAt.toISOString() };
  }

  async getFile(id: string): Promise<FileRecord | null> {
    const found = this.files.find((f) => f._id === id);
    return found ? { ...found, createdAt: found.createdAt.toISOString() } : null;
  }

  async getAllFiles(): Promise<FileRecord[]> {
    return [...this.files]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((f) => ({ ...f, createdAt: f.createdAt.toISOString() }));
  }

  private filterFiles(options: Omit<FileQueryOptions, "limit" | "cursor">): FileRecordDb[] {
    return this.files.filter((f) => {
      if (options.folder && options.folder !== "/" && f.folder !== options.folder) {
        return false;
      }
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        const matchesFilename = f.filename.toLowerCase().includes(searchLower);
        const matchesTags = f.tags?.some((t) => t.toLowerCase().includes(searchLower));
        if (!matchesFilename && !matchesTags) return false;
      }
      if (options.tags && options.tags.length > 0) {
        if (!f.tags || !options.tags.some((t) => f.tags?.includes(t))) {
          return false;
        }
      }
      return true;
    });
  }

  async queryFiles(options: FileQueryOptions): Promise<FileQueryResult> {
    const limit = options.limit || 50;
    let filtered = this.filterFiles(options);

    // Sort by createdAt descending
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filtered.length;

    // Apply cursor pagination
    if (options.cursor) {
      const cursorIndex = filtered.findIndex((f) => f._id === options.cursor);
      if (cursorIndex !== -1) {
        filtered = filtered.slice(cursorIndex + 1);
      }
    }

    // Apply limit
    const page = filtered.slice(0, limit);
    const nextCursor = page.length === limit && filtered.length > limit ? page[page.length - 1]._id : null;

    return {
      files: page.map((f) => ({ ...f, createdAt: f.createdAt.toISOString() })),
      nextCursor,
      total,
    };
  }

  async countFiles(options: Omit<FileQueryOptions, "limit" | "cursor">): Promise<number> {
    return this.filterFiles(options).length;
  }

  async deleteFile(id: string): Promise<void> {
    this.files = this.files.filter((f) => f._id !== id);
  }

  async updateFile(
    id: string,
    updates: { folder?: string; tags?: string[] }
  ): Promise<FileRecord | null> {
    const index = this.files.findIndex((f) => f._id === id);
    if (index === -1) return null;

    this.files[index] = {
      ...this.files[index],
      ...updates,
    };

    return {
      ...this.files[index],
      createdAt: this.files[index].createdAt.toISOString(),
    };
  }

  async getAllFolders(): Promise<string[]> {
    const folders = new Set<string>();
    folders.add("/"); // Always include root
    for (const file of this.files) {
      if (file.folder) {
        folders.add(file.folder);
      }
    }
    return [...folders].sort();
  }

  // --- Shop ---

  async getProducts(): Promise<Product[]> {
    return [...this.products].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getActiveProducts(): Promise<Product[]> {
    return this.products
      .filter((p) => p.active)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.products.find((p) => p._id === id) ?? null;
  }

  async saveProduct(product: ProductInput): Promise<Product> {
    const now = new Date().toISOString();
    const doc: ProductDb = {
      _id: crypto.randomUUID(),
      ...product,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(doc);
    return doc;
  }

  async updateProduct(id: string, product: ProductInput): Promise<Product | null> {
    const index = this.products.findIndex((p) => p._id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...product,
      updatedAt: new Date().toISOString(),
    };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    this.products = this.products.filter((p) => p._id !== id);
  }

  async getShopSettings(): Promise<ShopSettings> {
    return { ...this.shopSettings };
  }

  async saveShopSettings(settings: ShopSettings): Promise<void> {
    this.shopSettings = { ...settings };
  }

  async decrementStock(
    productId: string,
    variantIndex: number,
    quantity: number
  ): Promise<boolean> {
    const product = this.products.find((p) => p._id === productId);
    if (!product) return false;
    if (!product.variants[variantIndex]) return false;
    if (product.variants[variantIndex].stock < quantity) return false;
    product.variants[variantIndex].stock -= quantity;
    return true;
  }

  private processedSessions = new Set<string>();

  async isSessionProcessed(sessionId: string): Promise<boolean> {
    return this.processedSessions.has(sessionId);
  }

  async markSessionProcessed(sessionId: string): Promise<void> {
    this.processedSessions.add(sessionId);
  }

  // --- Hitobito Organigramm cache ---

  private organigrammCache = new Map<number, OrganigrammCache>();

  async getOrganigrammCache(
    rootGroupId: number
  ): Promise<OrganigrammCache | null> {
    return this.organigrammCache.get(rootGroupId) ?? null;
  }

  async saveOrganigrammCache(cache: OrganigrammCache): Promise<void> {
    this.organigrammCache.set(cache.rootGroupId, cache);
  }

  // --- Calendar ---

  private calendarGroups: CalendarGroupDb[] = [];
  private calendarEvents: CalendarEventDb[] = [];

  async getCalendarGroups(): Promise<CalendarGroup[]> {
    return [...this.calendarGroups].sort((a, b) => a.order - b.order);
  }

  async getCalendarGroup(id: string): Promise<CalendarGroup | null> {
    return this.calendarGroups.find((g) => g._id === id) ?? null;
  }

  async saveCalendarGroup(
    group: CalendarGroupInput
  ): Promise<CalendarGroup> {
    const doc: CalendarGroupDb = {
      _id: crypto.randomUUID(),
      ...group,
    };
    this.calendarGroups.push(doc);
    return doc;
  }

  async updateCalendarGroup(
    id: string,
    group: CalendarGroupInput
  ): Promise<CalendarGroup | null> {
    const index = this.calendarGroups.findIndex((g) => g._id === id);
    if (index === -1) return null;
    this.calendarGroups[index] = { ...this.calendarGroups[index], ...group };
    return this.calendarGroups[index];
  }

  async deleteCalendarGroup(id: string): Promise<void> {
    this.calendarGroups = this.calendarGroups.filter((g) => g._id !== id);
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return [...this.calendarEvents].sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async getCalendarEvent(id: string): Promise<CalendarEvent | null> {
    return this.calendarEvents.find((e) => e._id === id) ?? null;
  }

  async getEventsByGroup(groupSlug: string): Promise<CalendarEvent[]> {
    return this.calendarEvents
      .filter((e) => e.groups.includes(groupSlug) || e.allGroups)
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });
  }

  async getNextUpcomingEvent(
    groupSlug: string
  ): Promise<CalendarEvent | null> {
    const todayStr = getZurichDateString();
    const nowTime = getZurichTimeString();
    const upcoming = this.calendarEvents
      .filter(
        (e) =>
          (e.date > todayStr ||
            (e.date === todayStr && e.endTime > nowTime)) &&
          (e.groups.includes(groupSlug) || e.allGroups)
      )
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });
    return upcoming[0] ?? null;
  }

  async getAllUpcomingEvents(): Promise<CalendarEvent[]> {
    const todayStr = getZurichDateString();
    const nowTime = getZurichTimeString();
    return this.calendarEvents
      .filter(
        (e) =>
          e.date > todayStr ||
          (e.date === todayStr && e.endTime > nowTime)
      )
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });
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
    this.calendarEvents.push(doc);
    return doc;
  }

  async updateCalendarEvent(
    id: string,
    event: CalendarEventInput
  ): Promise<CalendarEvent | null> {
    const index = this.calendarEvents.findIndex((e) => e._id === id);
    if (index === -1) return null;
    this.calendarEvents[index] = {
      ...this.calendarEvents[index],
      ...event,
      updatedAt: new Date().toISOString(),
    };
    return this.calendarEvents[index];
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    this.calendarEvents = this.calendarEvents.filter((e) => e._id !== id);
  }
}
