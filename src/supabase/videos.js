import { supabase } from "./supabase";

export async function getVideos() {
  const { data, error } = await supabase.from('videos').select('*').order('date', { ascending: false })
  if (error) throw error
  return data
}

