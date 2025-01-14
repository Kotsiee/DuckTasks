import { Handlers } from "$fresh/server.ts";
import { fetchMessagesByChat } from "../../../../lib/api/messagesApi.ts";
import superjson from "https://esm.sh/superjson@2.2.2";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const chats = await fetchMessagesByChat(ctx.params.chatId)

    return new Response(superjson.stringify(chats), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
