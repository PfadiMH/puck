"use server";

import { NavbarDropdownProps } from "@components/puck/navbar/NavbarDropdown";
import { NavbarItemProps } from "@components/puck/navbar/NavbarItem";
import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import {
  extractSearchableSegments,
  SearchIndexEntry,
} from "@lib/search/extract-text";
import { SecurityConfig } from "@lib/security/security-config";
import { requireServerPermission } from "@lib/security/server-guard";
import { dbService } from "./db";

/**
 * Public Database Actions.
 * securely wraps internal service methods with permission checks.
 * Use this for all Client Components and Server Actions.
 */

export async function savePage(path: string, data: PageData) {
  await requireServerPermission({ any: ["page:create", "page:update"] });
  return dbService.savePage(path, data);
}

export async function deletePage(path: string) {
  await requireServerPermission({ all: ["page:delete"] });
  return dbService.deletePage(path);
}

export async function getPage(path: string): Promise<PageData | undefined> {
  return dbService.getPage(path);
}

export async function saveNavbar(data: NavbarData) {
  await requireServerPermission({ all: ["navbar:update"] });
  return dbService.saveNavbar(data);
}

export async function getNavbar(): Promise<NavbarData> {
  return dbService.getNavbar();
}

export async function saveFooter(data: FooterData) {
  await requireServerPermission({ all: ["footer:update"] });
  return dbService.saveFooter(data);
}

export async function getFooter(): Promise<FooterData> {
  return dbService.getFooter();
}

export async function getAllPaths() {
  return dbService.getAllPaths();
}

export async function getSecurityConfig() {
  await requireServerPermission({ all: ["role-permissions:read"] });
  return dbService.getSecurityConfig();
}

export async function saveSecurityConfig(permissions: SecurityConfig) {
  await requireServerPermission({ all: ["role-permissions:update"] });
  return dbService.saveSecurityConfig(permissions);
}

export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  try {
    const navbar = await dbService.getNavbar();
    const urls = new Set<string>();

    for (const component of navbar.content) {
      if (!component?.props) continue;
      if (component.type === "NavbarItem") {
        const { url } = component.props as NavbarItemProps;
        if (url) urls.add(url);
      }
      if (component.type === "NavbarDropdown") {
        const { items = [] } = component.props as NavbarDropdownProps;
        for (const item of items) {
          if (item.url) urls.add(item.url);
        }
      }
    }

    const settled = await Promise.allSettled(
      [...urls].map(async (url) => ({
        url,
        page: await dbService.getPage(url),
      })),
    );
    const pages = settled
      .filter(
        (r): r is PromiseFulfilledResult<{ url: string; page: PageData | undefined }> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);

    return pages.flatMap(({ url, page }) => {
      if (!page) return [];
      const title = page.root.props?.title || url;
      return extractSearchableSegments(page).map((segment) => ({
        path: url,
        title,
        text: segment.text,
        componentId: segment.componentId,
        weight: segment.weight,
      }));
    });
  } catch {
    return [];
  }
}
