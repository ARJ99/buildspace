import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import { relations } from "./schema/relations";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not defined in the environment.");
}

/**
 * Pass `relations` so the relational query builder (`db.query`)
 * knows about every table and relation declared in the schema.
 */
export const db = drizzle(connectionString, { relations });
