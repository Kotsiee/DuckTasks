import { supabase } from "../supabase/client.ts";
import { ChatType, Messages } from "../types/index.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchChatRole } from "./chatRolesApi.ts";

export async function fetchMessagesByChat(chatId: string): Promise<Messages[] | null> {
    const { data, error } = await supabase
        .from('messages')
        .select('*, chat_id(*)')
        .eq('chat_id', chatId)
        .order('sent_at', {ascending: true})

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const messages: Messages[] = await Promise.all(
        data.map(async (d) => {
            const chat = d.chat_id

            return {
                id: d.id,
                user: await fetchChatRole(d.user_id, chat.id),
                chat: {
                    id: chat.id,
                    chatType: ChatType[chat.chat_type as keyof typeof ChatType],
                    users: null,
                    name: chat.name,
                    meta: chat.meta,
                    photo: null,
                    createdAt: DateTime.fromISO(chat.created_at)
                },
                content: d.content,
                sentAt: DateTime.fromISO(d.sent_at)
            };
        })
    );

    return messages;
}