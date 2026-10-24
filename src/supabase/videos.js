import { supabase } from "./supabase";

export async function getVideos() {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

// READ one video by id
export async function getVideoById(id) {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// INSERT a new video
export async function insertVideo(video) {
  const { data, error } = await supabase
    .from("videos")
    .insert(video)
    .select()
    .single();
  if (error) throw error;
  return data;
}


export async function updateVideo(id, updates) {
  const { data, error } = await supabase
    .from("videos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// DELETE a video
export async function deleteVideo(id) {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
  return true;
}