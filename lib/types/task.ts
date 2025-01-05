import { DateTime } from "https://esm.sh/luxon@3.5.0";

export interface Task {
    id: string;
    projectId?: string;
    title?: string;
    description?: string;
    status?: string;
    meta?: TaskMeta;
    attachments?: string[];
    createdAt?: DateTime;
}

export interface TaskMeta {
    timeline: TaskTimeline;
    priority: string;
    subTasks: Task[];
}

export interface TaskTimeline {
    startDate: DateTime;
    endDate: DateTime;
}