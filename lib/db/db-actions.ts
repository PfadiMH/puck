"use server";

import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import { SecurityConfig } from "@lib/security/security-config";
import { requireServerPermission } from "@lib/security/server-guard";
import { dbService } from "./db";

/**
 * Save page data at the specified path, requiring create or update permission.
 *
 * Requires the caller to have either the `page:create` or `page:update` server permission.
 *
 * @param path - The page path where `data` will be stored
 * @param data - The page content and metadata to save
 * @returns The value returned by the database service for the saved page
 */

export async function savePage(path: string, data: PageData) {
  await requireServerPermission({ any: ["page:create", "page:update"] });
  return dbService.savePage(path, data);
}

/**
 * Deletes the page at the given path.
 *
 * @param path - The path of the page to delete
 * @returns The result returned by the database service indicating the deletion outcome
 * @throws If the caller lacks the `page:delete` permission
 */
export async function deletePage(path: string) {
  await requireServerPermission({ all: ["page:delete"] });
  return dbService.deletePage(path);
}

/**
 * Retrieve page data for the specified path.
 *
 * @param path - The page path to retrieve (for example, "/about")
 * @returns The page data for the given path, or `undefined` if no page exists
 */
export async function getPage(path: string): Promise<PageData | undefined> {
  return dbService.getPage(path);
}

/**
 * Saves navbar data; requires the `navbar:update` permission.
 *
 * @param data - Navbar data to persist
 * @returns The saved navbar data
 */
export async function saveNavbar(data: NavbarData) {
  await requireServerPermission({ all: ["navbar:update"] });
  return dbService.saveNavbar(data);
}

/**
 * Retrieve the site's navbar configuration.
 *
 * @returns The current `NavbarData` for the site
 */
export async function getNavbar(): Promise<NavbarData> {
  return dbService.getNavbar();
}

/**
 * Saves footer data after verifying the caller has the "footer:update" permission.
 *
 * @param data - Footer data to persist
 * @returns The saved footer data
 */
export async function saveFooter(data: FooterData) {
  await requireServerPermission({ all: ["footer:update"] });
  return dbService.saveFooter(data);
}

export async function getFooter(): Promise<FooterData> {
  return dbService.getFooter();
}

/**
 * Retrieve all stored paths.
 *
 * @returns An array containing the stored paths (structure depends on storage implementation)
 */
export async function getAllPaths() {
  return dbService.getAllPaths();
}

/**
 * Retrieves the application's security configuration.
 *
 * Requires the caller to have the `role-permissions:read` permission.
 *
 * @returns The current SecurityConfig
 * @throws If the caller lacks the `role-permissions:read` permission
 */
export async function getSecurityConfig() {
  await requireServerPermission({ all: ["role-permissions:read"] });
  return dbService.getSecurityConfig();
}

/**
 * Persist the provided security configuration.
 *
 * Requires the caller to have the "role-permissions:update" permission.
 *
 * @param permissions - The security configuration to save
 * @returns The saved `SecurityConfig`
 */
export async function saveSecurityConfig(permissions: SecurityConfig) {
  await requireServerPermission({ all: ["role-permissions:update"] });
  return dbService.saveSecurityConfig(permissions);
}