import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  _client = createClient<Database>(url, key);
  return _client;
}
