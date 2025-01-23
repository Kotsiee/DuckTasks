// deno-lint-ignore-file no-explicit-any
import { supabase } from "../supabase/client.ts";
import { Chat, ChatRoles } from "../types/index.ts";
import { ChatType } from "../types/types.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchChatRolesByChatID } from "./chatRolesApi.ts";

export async function fetchChatByID(id: string, simplify?: boolean): Promise<Chat | null> {
    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("fetchChatByID error was found :( - " + error.message);
        return null;
    }

    const chats: Chat = {
        id: data.id,
        chatType: ChatType[data.chat_type as keyof typeof ChatType],
        users: simplify == true ? null : await fetchChatRolesByChatID(data.id, true),
        name: data.name,
        meta: data.meta,
        // lastMessage?: Messages,
        photo: null,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return chats;
}

export async function fetchUserChatsByID(userId: string, simplify?: boolean): Promise<Chat[] | null> {
    const { data, error } = await supabase
        .from('chat roles')
        .select('user_id, chat_id(*)')
        .eq('user_id', userId)

    if(error){
        console.log("fetchUserChatsByID: error was found :( - " + error.details);
        return null;
    }

    const chats: Chat[] = await Promise.all(
        data.map(async (d: any) => {
            return {
                id: d.chat_id.id,
                chatType: ChatType[d.chat_id.chat_type as keyof typeof ChatType],
                users: simplify == true ? null : await fetchChatRolesByChatID(d.chat_id.id, true),
                name: d.chat_id.name,
                meta: d.chat_id.meta,
                // lastMessage?: Messages,
                photo: null,
                createdAt: DateTime.fromISO(d.chat_id.created_at)
            };
        })
    );

    return chats;
}