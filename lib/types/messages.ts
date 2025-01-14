import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Chat, ChatRoles, Files } from "./index.ts";

export interface Messages {
    id: string;
    user: ChatRoles | null;
    chat: Chat | null;
    content: string;
    attachments?: Files[];
    sentAt: DateTime;
}