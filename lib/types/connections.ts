import { DateTime } from "https://esm.sh/luxon@3.5.0";

export interface Connection {
    id: string;
    userId1: string;
    userId2: string;
    status: connectionStatus;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export enum connectionStatus{
    pending,
    accepted,
    blocked
}