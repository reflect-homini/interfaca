import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProjectEntriesApi } from "../api/entries";
import type { Entry } from "@/features/projects/schemas/project";

/**
 * Fetches the entries that a summary covers.
 * Uses the summary's endEntryId and entriesCount to find relevant entries.
 * Only fetches when enabled (user clicks "Show entries").
 */
export function useSummaryEntriesQuery(
  projectId: string,
  summaryId: string,
  endEntryId: string,
  enabled: boolean,
) {
  return useQuery<Entry[]>({
    queryKey: queryKeys.summaryEntries(summaryId),
    queryFn: () => getProjectEntriesApi(projectId, endEntryId),
    enabled,
    staleTime: Infinity, // Summary entries don't change
  });
}
