import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env.local" });

function withSsl(url: string | undefined): string {
  if (!url) return "";
  const parsed = new URL(url);
  if (!parsed.searchParams.has("sslmode")) parsed.searchParams.set("sslmode", "require");
  return parsed.toString();
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  // Supabase owns the auth, storage and realtime schemas; only manage ours.
  schemaFilter: ["public"],
  dbCredentials: {
    url: withSsl(process.env.DATABASE_URL),
  },
});
