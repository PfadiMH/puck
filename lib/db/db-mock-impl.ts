import { defaultFooterData } from "@lib/config/footer.config";
import { defaultNavbarData } from "@lib/config/navbar.config";
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
}
