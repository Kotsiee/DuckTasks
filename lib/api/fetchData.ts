import { supabase } from "../supabase/client.ts";

export async function getFileUrl(filePath: string) {
    const { data } = await supabase
      .storage
      .from('user_uploads')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
}