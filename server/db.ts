import dotenv from 'dotenv';
dotenv.config();

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use server-side environment variable, not VITE_ prefixed one for security
const databaseUrl = process.env.DATABASE_URL;
console.log('Database connection status:', databaseUrl ? 'Connected' : 'Not configured');

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
