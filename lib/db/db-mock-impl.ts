import { defaultFooterData } from "@lib/config/footer.config";
import { defaultNavbarData } from "@lib/config/navbar.config";
import { defaultSecurityConfig } from "@lib/security/security-config";
import type {
  FileRecord,
  FileRecordDb,
  FileRecordInput,
} from "@lib/storage/file-record";
import type { DatabaseService } from "./db";

export class MockDatabaseService implements DatabaseService {
  private files: FileRecordDb[] = [];

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

  async deleteFile(id: string): Promise<void> {
    this.files = this.files.filter((f) => f._id !== id);
  }
}
