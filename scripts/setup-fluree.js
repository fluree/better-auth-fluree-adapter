#!/usr/bin/env node

const FlureeClient = require("@fluree/fluree-client").default;

async function setupFluree() {
  const config = {
    url: process.env.FLUREE_URL || "http://localhost:58090",
    ledger: process.env.FLUREE_LEDGER || "better-auth",
  };

  console.log("Setting up Fluree database...");
  console.log(`URL: ${config.url}`);
  console.log(`Ledger: ${config.ledger}`);

  try {
    const client = new FlureeClient(config);
    
    // Try to create the ledger
    console.log("Creating ledger...");
    await client.create({
      ledger: config.ledger,
      insert: {
        "@id": "ex:init",
        "createdAt": "#(now)",
        "description": "Better Auth ledger initialization"
      }
    });

    console.log("✅ Fluree database setup complete!");
    console.log("\nMake sure to:");
    console.log("1. Start Fluree server if not running");
    console.log("2. Update .env.local with correct FLUREE_URL");
    console.log("3. Set BETTER_AUTH_SECRET in .env.local");
    console.log("4. Add OAuth provider credentials if using social login");
    
  } catch (error) {
    if (error.message?.includes("already exists")) {
      console.log("✅ Ledger already exists, ready to use!");
    } else {
      console.error("❌ Error setting up Fluree:", error.message);
      console.log("\nTroubleshooting:");
      console.log("1. Make sure Fluree is running at", config.url);
      console.log("2. Check if the ledger already exists");
      console.log("3. Verify network connectivity");
    }
  }
}

setupFluree();