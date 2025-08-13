
import { db } from "./db.js";
import { sql } from "drizzle-orm";

async function setupDatabase() {
  try {
    console.log("Setting up database tables...");
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        is_retail_allowed BOOLEAN DEFAULT false
      )
    `);
    
    // Create other essential tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS flights (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        flight_number TEXT NOT NULL UNIQUE,
        airline TEXT NOT NULL,
        aircraft TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NOT NULL,
        duration TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        available_seats INTEGER NOT NULL,
        total_seats INTEGER NOT NULL,
        cabin TEXT NOT NULL,
        stops INTEGER DEFAULT 0,
        status TEXT DEFAULT 'scheduled' NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bids (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id INTEGER NOT NULL,
        flight_id INTEGER NOT NULL,
        bid_amount DECIMAL(10, 2) NOT NULL,
        passenger_count INTEGER NOT NULL,
        bid_status TEXT DEFAULT 'active' NOT NULL,
        valid_until TIMESTAMP NOT NULL,
        notes TEXT,
        total_seats_available INTEGER DEFAULT 50,
        min_seats_per_bid INTEGER DEFAULT 1,
        max_seats_per_bid INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `);
    
    console.log("Database tables created successfully!");
    
    // Create default admin user if it doesn't exist
    const existingAdmin = await db.execute(sql`
      SELECT * FROM users WHERE username = 'admin' LIMIT 1
    `);
    
    if (existingAdmin.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO users (username, password, name, email, is_retail_allowed)
        VALUES ('admin', ${Buffer.from("admin123").toString("base64")}, 'Administrator', 'admin@grab.com', true)
      `);
      console.log("Default admin user created: username=admin, password=admin123");
    }
    
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => {
      console.log("Database setup completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database setup failed:", error);
      process.exit(1);
    });
}

export { setupDatabase };
