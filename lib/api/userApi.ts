import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { User } from "../types/index.ts";
import { supabase } from "../supabaseClient.ts";
import { getFileUrl } from "./fetchData.ts";

export async function fetchUsers(): Promise<User[] | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const users: User[] = await Promise.all(
        data.map(async (d) => {
            const profilePic = await getFileUrl(`users/${d.id}/${d.profile_picture}`);
            return {
                id: d.id,
                email: d.primary_email,
                username: d.username,
                firstName: d.first_name,
                lastName: d.last_name,
                profilePicture: profilePic,
                meta: d.meta,
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return users;
}

export async function fetchUserByID(id: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    return data[0];
}

export async function searchUsers(term: string): Promise<User[] | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', `%${term}%`)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    return data;
}