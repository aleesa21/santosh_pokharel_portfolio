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

const BUCKET = "photos";

// ---------- Photos ----------

// Build the public URL from a stored path (no network request)
export function getPhotoUrl(path) {
  if (!path) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Upload a file to the bucket and return its path
export async function uploadPhoto(rowId, file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${rowId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) throw error;

  return path;
}

// Delete a file from the bucket
export async function deletePhoto(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}