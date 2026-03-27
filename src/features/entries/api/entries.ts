import { apiRequest } from "@/api/client";
import type { Entry } from "@/features/projects/schemas/project";

/** The create endpoint returns an entry without itemType in the response */
interface CreateEntryResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  content: string;
}

export async function createEntryApi(
  projectId: string,
  content: string,
): Promise<Entry> {
  const res = await apiRequest<CreateEntryResponse>(
    `/projects/${projectId}/entries`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  return { ...res, itemType: "entry" };
}

export async function updateEntryApi(
  projectId: string,
  entryId: string,
  content: string,
): Promise<Entry> {
  const res = await apiRequest<CreateEntryResponse>(
    `/projects/${projectId}/entries/${entryId}`,
    {
      method: "PUT",
      body: JSON.stringify({ content }),
    },
  );
  return { ...res, itemType: "entry" };
}

export async function deleteEntryApi(
  projectId: string,
  entryId: string,
): Promise<void> {
  return apiRequest<void>(`/projects/${projectId}/entries/${entryId}`, {
    method: "DELETE",
  });
}

/** Fetch entries for a project, optionally after a specific entry */
export async function getProjectEntriesApi(
  projectId: string,
  afterEntryId?: string,
): Promise<Entry[]> {
  const params = afterEntryId ? `?afterEntryId=${afterEntryId}` : "";
  const entries = await apiRequest<CreateEntryResponse[]>(
    `/projects/${projectId}/entries${params}`,
  );
  return entries.map((e) => ({ ...e, itemType: "entry" as const }));
}

export async function getSummaryEntriesApi(
  projectId: string,
  summaryId: string,
): Promise<Entry[]> {
  const entries = await apiRequest<CreateEntryResponse[]>(
    `/projects/${projectId}/summaries/${summaryId}/entries`,
  );
  return entries.map((e) => ({ ...e, itemType: "entry" as const }));
}
