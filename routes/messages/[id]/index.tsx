//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ChatMessages from "../../../islands/chat/ChatMessages.tsx";
import { supabase, SupabaseInfo } from "../../../lib/supabase/client.ts";
import { useUser } from "../../../components/UserContext.tsx";

export default function Conversations(props: PageProps) {
  const supabaseInfo = new SupabaseInfo(supabase);
  const url = supabaseInfo.getUrl();
  const key = supabaseInfo.getAnonKey();

  const user = useUser();

  return (
    <Partial name="convo-messages">
      <ChatMessages
        pageProps={props}
        p={{ supabaseUrl: url, supabaseAnonKey: key, user: user! }}
      />
    </Partial>
  );
}
