import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadDocumentToSupabase(file: File) {
  const filePath = `exit-requests/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("scriptcruisetest-files") // 👈 make sure this is your bucket name
    .upload(filePath, file, { upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("scriptcruisetest-files").getPublicUrl(filePath);

  return publicUrl;
}
