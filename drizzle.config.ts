import type { Config } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:M_asdf_321@localhost:5432/online_judge';

export default {
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
