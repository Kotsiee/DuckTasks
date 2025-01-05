import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { supabase } from "../supabaseClient.ts";
import { Task } from "../types/index.ts";

export async function fetchTasksByProject(id: string): Promise<Task[] | null> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const tasks: Task[] = await Promise.all(
        data.map(async (d) => {
            const attachments: string[] = d.attachments;
            return {
                id: d.id,
                projectId: d.project_id,
                title: d.title,
                description: d.description,
                status: d.status,
                attachments: attachments,
                meta: d.meta,
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return tasks;
}