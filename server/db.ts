import dotenv from 'dotenv';
dotenv.config();

//Add VITE_DATABASE_URL to .env file
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;
console.log(process.env.VITE_DATABASE_URL);

if (!process.env.VITE_DATABASE_URL) {
  throw new Error(
    "VITE_DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.VITE_DATABASE_URL });
export const db = drizzle({ client: pool, schema });
