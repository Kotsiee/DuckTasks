import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { ChatRoles, ChatType, Logo, Messages } from "./index.ts";

export interface Chat {
    id: string;
    chatType: ChatType;
    users: ChatRoles[] | null;
    name: string | null;
    meta: ChatMeta | null;
    lastMessage?: Messages;
    photo: Logo | null;
    createdAt: DateTime;
}

export interface ChatMeta{
    desc: string
}