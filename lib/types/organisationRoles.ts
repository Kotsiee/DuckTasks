// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export interface OrganisationRoles {
    id: string;
    userId: string;
    organisationId: string;
    role: string;
    access?: Record<string, any>[];
    updatedAt?: DateTime;
}