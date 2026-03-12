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

export async function updateEntryApi(
  projectId: string,
  entryId: string,
  content: string,
): Promise<Entry> {
  return apiRequest<Entry>(`/projects/${projectId}/entries/${entryId}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export async function deleteEntryApi(
  projectId: string,
  entryId: string,
): Promise<void> {
  return apiRequest<void>(`/projects/${projectId}/entries/${entryId}`, {
    method: "DELETE",
  });
}
