import { supabase } from "../supabaseClient.ts";
import { ChatRoles, ChatType, Roles } from "../types/index.ts";
import { fetchChatByID } from "./chatApi.ts";
import { fetchUserByID } from "./userApi.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export async function fetchChatRole(userId: string, chatId: string): Promise<ChatRoles | null> {
    const { data, error } = await supabase
        .from('chat roles')
        .select('*, chat_id(*)')
        .eq('user_id', userId)
        .eq('chat_id', chatId)
        .single()

    if(error){
        console.log("error was found :( - " + error.cause);
        return null;
    }

    const chat = data.chat_id

    const chatRole: ChatRoles = {
        id: data.id,
        user: await fetchUserByID(data.user_id),
        chat: {
            id: chat.id,
            chatType: ChatType[chat.chat_type as keyof typeof ChatType],
            users: null,
            name: chat.name,
            meta: chat.meta,
            photo: null,
            createdAt: DateTime.fromISO(chat.created_at)
        },
        role: Roles[data.role as keyof typeof Roles],
        joinedAt: DateTime.fromISO(data.joined_at)
    }

    return chatRole;
}

export async function fetchChatRolesByUserID(userId: string): Promise<ChatRoles[] | null> {
    const { data, error } = await supabase
        .from('chat roles')
        .select('*')
        .eq('user_id', userId)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    return data;
}

export async function fetchChatRolesByChatID(chatId: string): Promise<ChatRoles[] | null> {
    const { data, error } = await supabase
        .from('chat roles')
        .select('*, chat_id(*)')
        .eq('chat_id', chatId)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const chatRoles: ChatRoles[] = await Promise.all(
        data.map(async (d) => {
            const chat = d.chat_id

            return {
                id: d.id,
                user: await fetchUserByID(d.user_id),
                chat: {
                    id: chat.id,
                    chatType: ChatType[chat.chat_type as keyof typeof ChatType],
                    users: null,
                    name: chat.name,
                    meta: chat.meta,
                    photo: null,
                    createdAt: DateTime.fromISO(chat.created_at)
                },
                role: Roles[d.role as keyof typeof Roles],
                joinedAt: DateTime.fromISO(d.joined_at)
            };
        })
    );

    return chatRoles;
}