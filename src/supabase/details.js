import { supabase } from "./supabase";

export async function getPersonalDetails() {
  const { data, error } = await supabase
    .from("personal_details")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

// UPDATE the personal details
export async function updatePersonalDetails(id, updates) {
  const { data, error } = await supabase
    .from("personal_details")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}