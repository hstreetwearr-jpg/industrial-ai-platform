import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cxukdkxstweaqudaadsq.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_ANON_KEY. Configúrala en el archivo .env.local.");
  }

  return createBrowserClient(url, key);
}