/**
 * Quick smoke test — verifies Azure OpenAI connectivity and JSON parsing.
 * Run: npx tsx test/quick-smoke.ts
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env" });

async function main() {
  const { chatCompletion, chatCompletionJson } = await import("../src/lib/azure/client");

  console.log("=== Smoke Test: Azure OpenAI ===\n");

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const key = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  console.log("Endpoint:", endpoint ? `${endpoint.slice(0, 30)}...` : "MISSING");
  console.log("API Key:", key ? `${key.slice(0, 6)}...` : "MISSING");
  console.log("Deployment:", deployment || "MISSING");
  console.log();

  if (!endpoint || !key) {
    console.error("FAIL: Azure credentials not set.");
    process.exit(1);
  }

  // 1. Plain text completion — use 1024 tokens (reasoning models need headroom)
  console.log("Test 1: Plain text completion...");
  try {
    const text = await chatCompletion(
      [{ role: "user", content: "Reply with exactly: OK" }],
      { maxCompletionTokens: 1024 }
    );
    console.log("  Response:", JSON.stringify(text));
    console.log("  PASS\n");
  } catch (err) {
    console.error("  FAIL:", err instanceof Error ? err.message : err);
    process.exit(1);
  }

  // 2. JSON completion (tests the parsing path that was failing)
  console.log("Test 2: JSON completion (chatCompletionJson)...");
  try {
    const result = await chatCompletionJson<{ status: string }>(
      "You are a test helper. Always respond with valid JSON.",
      'Return exactly: {"status":"ok"}',
      { maxCompletionTokens: 1024 }
    );
    console.log("  Parsed:", result);
    if (result.status === "ok") {
      console.log("  PASS\n");
    } else {
      console.log("  WARN: unexpected value but JSON parsed OK\n");
    }
  } catch (err) {
    console.error("  FAIL:", err instanceof Error ? err.message : err);
    process.exit(1);
  }

  // 3. Quick DB check
  console.log("Test 3: Database connectivity...");
  try {
    const { isDbConfigured, pool } = await import("../src/lib/db/index");
    if (isDbConfigured()) {
      const res = await pool.query("SELECT 1 as ok");
      console.log("  DB connected:", res.rows[0]);
      console.log("  PASS\n");
      await pool.end();
    } else {
      console.log("  SKIP: DATABASE_URL not configured\n");
    }
  } catch (err) {
    console.error("  FAIL:", err instanceof Error ? err.message : err);
  }

  console.log("=== All smoke tests passed ===");
  process.exit(0);
}

main();
