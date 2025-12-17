import { drizzle } from 'drizzle-orm/postgres-js';
const postgres = require('postgres');
import * as schema from './schema';

// Database connection string - will be loaded from environment variables
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:M_asdf_321@localhost:5432/online_judge';

// Create the connection
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export types
export type Database = typeof db;
