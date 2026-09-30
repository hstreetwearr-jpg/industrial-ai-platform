import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureOrganization(client: SupabaseClient, user: User) {
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (profile?.organization_id) return profile.organization_id as string;

  const organizationName = user.user_metadata?.organization_name;
  if (typeof organizationName !== "string" || !organizationName.trim()) {
    throw new Error("No encontramos una organización asociada a esta cuenta.");
  }

  const { data: organization, error: organizationError } = await client
    .from("organizations")
    .insert({ name: organizationName.trim(), created_by: user.id })
    .select("id")
    .single();

  if (organizationError) throw organizationError;

  const { error: createProfileError } = await client.from("profiles").insert({
    id: user.id,
    organization_id: organization.id,
    full_name: user.user_metadata?.full_name || null,
    role: "admin",
  });

  if (createProfileError) throw createProfileError;
  return organization.id as string;
}