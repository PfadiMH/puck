import { defaultFooterData } from "@lib/config/footer.config";
import { defaultNavbarData } from "@lib/config/navbar.config";
import { defaultSecurityConfig } from "@lib/security/permissions";
import { DatabaseService } from "./types";

export class MockDatabaseService implements DatabaseService {
  async savePage() { }
  async deletePage() { }
  async getPage() {
    return undefined;
  }
  async saveNavbar() { }
  async getNavbar() {
    return defaultNavbarData;
  }
  async saveFooter() { }
  async getFooter() {
    return defaultFooterData;
  }
  async getAllPaths() {
    return [];
  }
  async getSecurityConfig() {
    return defaultSecurityConfig;
  }
  async saveSecurityConfig() { }
}
