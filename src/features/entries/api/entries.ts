import { apiRequest } from "@/api/client";
import type { Entry } from "@/features/projects/schemas/project";

export async function createEntryApi(
  projectId: string,
  content: string,
): Promise<Entry> {
  return apiRequest<Entry>(`/projects/${projectId}/entries`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
