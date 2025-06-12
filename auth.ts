import { betterAuth } from "better-auth";
import { flureeAdapter } from "./lib/auth/adapters/fluree-adapter";

// Log to debug
console.log("Initializing Better Auth with Fluree adapter...");
console.log("Fluree URL:", process.env.FLUREE_URL || "http://localhost:58090");
console.log("Fluree Ledger:", process.env.FLUREE_LEDGER || "better-auth");

export const auth = betterAuth({
  database: flureeAdapter({
    url: process.env.FLUREE_URL || "http://localhost:58090",
    ledger: process.env.FLUREE_LEDGER || "better-auth",
    apiKey: process.env.FLUREE_API_KEY,
    debugLogs: true // Always enable for now
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false // Set to true in production
  },
  
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  
  secret: process.env.BETTER_AUTH_SECRET!,
  
  // Additional options
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  }
});
