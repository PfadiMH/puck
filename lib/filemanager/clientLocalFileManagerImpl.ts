import { FileManagerService } from "./filemanager";
import {
  deleteFile,
  getFile,
  getFileNames,
  getFileUrl,
  initializeDirectory,
  saveFile,
} from "./localFileManagerImpl";

export class LocalFileManagerImpl implements FileManagerService {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    initializeDirectory(this.dbPath);
  }
  async deleteFile(name: string): Promise<void> {
    deleteFile(this.dbPath, name);
  }
  getFileUrl(name: string): Promise<string> {
    return getFileUrl(this.dbPath, name);
  }
  async getFile(name: string): Promise<string> {
    return getFile(this.dbPath, name);
  }
  async getFileNames(): Promise<string[]> {
    return await getFileNames(this.dbPath);
  }

  public async saveFile(file: File): Promise<void> {
    saveFile(this.dbPath, file);
  }
}
