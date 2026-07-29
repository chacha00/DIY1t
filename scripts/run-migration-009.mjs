import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);

const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"], {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sql = readFileSync(new URL("../supabase/migrations/0009_saved_projects_makes.sql", import.meta.url), "utf-8");

const { error } = await supabase.rpc("exec_sql", { sql }).single();
if (error) {
  // Try direct query via the db URL instead
  console.log("RPC not available, migration must be run in Supabase SQL Editor.");
  console.log("\nCopy and paste the following SQL into your Supabase SQL Editor:");
  console.log("https://supabase.com/dashboard/project/fibncgiapxzckosbqadf/sql\n");
  console.log(sql);
} else {
  console.log("Migration applied successfully!");
}
