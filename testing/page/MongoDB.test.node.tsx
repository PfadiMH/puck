import { MongoService } from "@lib/db/db-mongo-impl";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("MongoService Integration", () => {
  let service: MongoService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const dbName = "test-db";

    service = new MongoService(uri, dbName);
    await service.connect();

    let retries = 0;
    while (retries < 20) {
      try {
        await service.getNavbar();
        await service.getFooter();
        await service.getSecurityConfig();
        break;
      } catch (e) {
        retries++;
        if (retries >= 20) {
          throw new Error(
            "Failed to initialize MongoService readiness check after 20 retries",
          );
        }
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  });

  afterAll(async () => {
    if (service) {
      await service.disconnect();
    }
    if (mongod) {
      await mongod.stop();
    }
  });

  it("should save and retrieve a page", async () => {
    const path = "/test-page";
    const pageData = {
      content: [],
      root: { props: { title: "Test Page" } },
      zones: {},
    };

    await service.savePage(path, pageData);
    const retrieved = await service.getPage(path);

    expect(retrieved).toEqual(pageData);
  });

  it("should update a page", async () => {
    const path = "/test-page";
    const initialData = {
      content: [],
      root: { props: { title: "Test Page" } },
      zones: {},
    };
    await service.savePage(path, initialData);
    const updatedData = {
      content: [],
      root: { props: { title: "Updated Test Page" } },
      zones: {},
    };

    await service.savePage(path, updatedData);
    const retrieved = await service.getPage(path);

    expect(retrieved).toEqual(updatedData);
  });

  it("should delete a page", async () => {
    const path = "/test-page-delete";
    const pageData = {
      content: [],
      root: { props: { title: "To Delete" } },
      zones: {},
    };

    await service.savePage(path, pageData);
    await service.deletePage(path);
    const retrieved = await service.getPage(path);

    expect(retrieved).toBeUndefined();
  });

  it("should retrieve default navbar", async () => {
    const navbar = await service.getNavbar();

    expect(navbar).toBeDefined();
  });

  it("should retrieve default footer", async () => {
    const footer = await service.getFooter();

    expect(footer).toBeDefined();
  });
});
