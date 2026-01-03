import { env } from "@lib/env";
import { MockDatabaseService } from "./mock";
import { MongoService } from "./mongo";
import { DatabaseService } from "./types";

/**
 * Internal Database Service.
 * DIRECT ACCESS - BYPASSES PERMISSION CHECKS.
 * Use only in trusted server contexts (e.g. API routes with their own auth).
 * For UI/Client access, use @lib/db/database.ts instead.
 */
function getDatabaseService(): DatabaseService {
  const connectionString = env.MONGODB_CONNECTION_STRING;
  const dbName = env.MONGODB_DB_NAME;

  if (!connectionString) {
    if (process.env.SKIP_ENV_VALIDATION) {
      console.warn(
        "Missing MONGODB_CONNECTION_STRING, using MockDatabaseService (SKIP_ENV_VALIDATION is true)"
      );
      return new MockDatabaseService();
    }
  }

  if (!connectionString || !dbName) {
    console.warn("Missing MongoDB credentials, using MockDatabaseService");
    return new MockDatabaseService();
  }

  console.log("Using MongoDB storage");
  return new MongoService(connectionString, dbName);
}

export const dbService = getDatabaseService();
