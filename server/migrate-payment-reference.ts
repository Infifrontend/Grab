
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function migratePaymentReference() {
  try {
    console.log("Adding payment_reference column to payments table...");
    
    // Add payment_reference column to payments table
    await db.execute(sql`
      ALTER TABLE payments 
      ADD COLUMN IF NOT EXISTS payment_reference TEXT UNIQUE
    `);
    
    // Update existing payments with generated payment references
    const existingPayments = await db.execute(sql`
      SELECT id FROM payments WHERE payment_reference IS NULL
    `);
    
    for (const payment of existingPayments.rows) {
      const paymentReference = `PAY-${new Date().getFullYear()}-${nanoid(6)}`;
      await db.execute(sql`
        UPDATE payments 
        SET payment_reference = ${paymentReference} 
        WHERE id = ${payment.id}
      `);
    }
    
    // Make the column NOT NULL after populating existing records
    await db.execute(sql`
      ALTER TABLE payments 
      ALTER COLUMN payment_reference SET NOT NULL
    `);
    
    console.log("Successfully added payment_reference column to payments table");
  } catch (error) {
    console.error("Error migrating payments table:", error);
    throw error;
  }
}
