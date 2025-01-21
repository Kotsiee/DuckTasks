// deno-lint-ignore-file no-explicit-any
import { supabase } from "../supabase/client.ts";
import { Chat, ChatRoles } from "../types/index.ts";
import { ChatType } from "../types/types.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchChatRolesByChatID } from "./chatRolesApi.ts";

export async function fetchChatByID(id: string): Promise<Chat | null> {
    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const chats: Chat = {
        id: data.id,
        chatType: ChatType[data.chat_type as keyof typeof ChatType],
        users: await fetchChatRolesByChatID(data.id),
        name: data.name,
        meta: data.meta,
        // lastMessage?: Messages,
        photo: null,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return chats;
}

export async function fetchUserChatsByID(userId: string): Promise<Chat[] | null> {
    const { data, error } = await supabase
        .from('chat roles')
        .select('user_id, chat_id(*)')
        .eq('user_id', userId)

    if(error){
        console.log("error was found :( - " + error.details);
        return null;
    }

    const chats: Chat[] = await Promise.all(
        data.map(async (d: any) => {
            const chat = d.chat_id

            return {
                id: chat.id,
                chatType: ChatType[chat.chat_type as keyof typeof ChatType],
                users: await fetchChatRolesByChatID(chat.id),
                name: chat.name,
                meta: chat.meta,
                // lastMessage?: Messages,
                photo: null,
                createdAt: DateTime.fromISO(chat.created_at)
            };
        })
    );

    return chats;
}