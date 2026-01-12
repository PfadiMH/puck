"use server";

import { SecurityConfig } from "@lib/security/permissions";
import { requireServerPermission } from "@lib/security/server-guard";
import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import { dbService } from "./service";

/**
 * Public Database Actions.
 * securely wraps internal service methods with permission checks.
 * Use this for all Client Components and Server Actions.
 */

export async function savePage(path: string, data: PageData) {
  await requireServerPermission(["page:create", "page:update"]);
  return dbService.savePage(path, data);
}

export async function deletePage(path: string) {
  await requireServerPermission(["page:delete"]);
  return dbService.deletePage(path);
}

export async function getPage(path: string): Promise<PageData | undefined> {
  return dbService.getPage(path);
}

export async function saveNavbar(data: NavbarData) {
  await requireServerPermission(["navbar:update"]);
  return dbService.saveNavbar(data);
}

export async function getNavbar(): Promise<NavbarData> {
  return dbService.getNavbar();
}

export async function saveFooter(data: FooterData) {
  await requireServerPermission(["footer:update"]);
  return dbService.saveFooter(data);
}

export async function getFooter(): Promise<FooterData> {
  return dbService.getFooter();
}

export async function getAllPaths() {
  return dbService.getAllPaths();
}

export async function getSecurityConfig() {
  await requireServerPermission(["role-permissions:read"]);
  return dbService.getSecurityConfig();
}

export async function saveSecurityConfig(permissions: SecurityConfig) {
  await requireServerPermission(["role-permissions:update"]);
  return dbService.saveSecurityConfig(permissions);
}
