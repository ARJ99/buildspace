import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './app/db/schema/*.ts',
	dialect: 'postgresql',
	// Only manage the `public` schema. The database is hosted on Prisma Postgres,
	// which keeps its own managed objects (extension `prisma_postgres`, schema
	// `ppg.*` incl. the `query_stats` view). Without this, `drizzle-kit push`
	// tries to drop those Prisma-managed objects and fails.
	schemaFilter: ['public'],
	strict: true,
	verbose: true,
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});

