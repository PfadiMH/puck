import { ABSFileManagerImpl } from "./asbFilleManagerImpl";
import { LocalFileManagerImpl } from "./clientLocalFileManagerImpl";
import { createAccountSas, getAccountInfos } from "./sas";

export interface FileManagerService {
  deleteFile(name: string): Promise<void>;
  saveFile(file: File): Promise<void>;
  getFileUrl(name: string): Promise<string>;
  getFile(name: string): Promise<string>;
  getFileNames(): Promise<string[]>;
}

export async function getFileManagerService(): Promise<FileManagerService> {
  try {
    const accountSas = await createAccountSas();
    if (accountSas) {
      const accountInfos = await getAccountInfos();
      return new ABSFileManagerImpl(
        accountInfos.containerName,
        accountInfos.accountName,
        accountSas
      );
    }
  } catch (e) {
    console.log("Using JSON storage");
  }
  return new LocalFileManagerImpl("./public/uploadedFiles");
}
