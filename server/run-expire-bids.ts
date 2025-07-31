
#!/usr/bin/env node

import { expireOldBids } from "./expire-old-bids.js";

async function main() {
  try {
    console.log("=".repeat(50));
    console.log("EXPIRED BIDS CLEANUP SCRIPT");
    console.log("=".repeat(50));
    
    const result = await expireOldBids();
    
    console.log("\n" + "=".repeat(50));
    console.log("CLEANUP SUMMARY");
    console.log("=".repeat(50));
    console.log(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Message: ${result.message}`);
    console.log(`Bids Updated: ${result.updatedCount}`);
    console.log("=".repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error("\n" + "=".repeat(50));
    console.error("CLEANUP FAILED");
    console.error("=".repeat(50));
    console.error("Error:", error.message);
    console.error("=".repeat(50));
    process.exit(1);
  }
}

main();
