// implementation of the file manager for ASB inplements the interface
import { FilemanagerService } from "./filemanager";

/**
 * JSON file implementation of DatabaseService
 * Data is stored in a single JSON file.
 */
export class FilemanagerJsonService implements FilemanagerService {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await fs.readFile(this.dbPath, "utf-8");
    } catch (error) {
      // If the file doesn't exist, create it with default data
      await this.saveDatabase({});
    }
  }

  async deleteFile(name: string): Promise<void> {
    const db = (await this.getDatabase()) as { [key: string]: any };
    delete db[name];
    await this.saveDatabase(db);
  }

  async saveFile(file: File): Promise<void> {
    console.log("Saving file:", file.name);
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");
    const fileData = {
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      content: base64Content,
      isBase64: true,
    };
    const db = (await this.getDatabase()) as { [key: string]: any };
    db[file.name] = fileData;
    await this.saveDatabase(db);
  }

  private async saveDatabase(db: object): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(db));
  }

  async getFile(name: string): Promise<string> {
    console.log("Getting file:", name);
    return new Promise(async (resolve) => {
      const db = (await this.getDatabase()) as { [key: string]: any };
      if (db[name]) {
        const fileData = db[name];
        let content;

        content = Buffer.from(fileData.content, "base64");

        const blob = new Blob([content], { type: fileData.type });
        const file = new File([blob], name, {
          type: fileData.type,
          lastModified: fileData.lastModified,
        });
        console.log("File found:", file);
        resolve(URL.createObjectURL(file));
      }
    });
  }

  async getFileNames(): Promise<string[]> {
    const db = (await this.getDatabase()) as { [key: string]: any };
    return Object.keys(db);
  }

  private async getDatabase(): Promise<object> {
    const dbFile = await fs.readFile(this.dbPath, "utf-8");
    return JSON.parse(dbFile);
  }
}
