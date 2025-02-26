//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../components/UserContext.tsx";
import ChatMessages from "../../../../islands/chat/ChatMessages.tsx";
import { SupabaseInfo, supabase } from "../../../../lib/supabase/client.ts";

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
