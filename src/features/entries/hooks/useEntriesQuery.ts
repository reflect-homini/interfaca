import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProjectApi } from "@/features/projects/api/projects";
import type { Entry } from "@/features/projects/schemas/project";

const MAX_RENDERED_ENTRIES = 500;

export function useEntriesQuery(projectId: string) {
  return useQuery({
    queryKey: queryKeys.entries(projectId),
    queryFn: async (): Promise<{ entries: Entry[]; truncated: boolean }> => {
      const project = await getProjectApi(projectId);
      const all = project.entries ?? [];
      if (all.length > MAX_RENDERED_ENTRIES) {
        return {
          entries: all.slice(all.length - MAX_RENDERED_ENTRIES),
          truncated: true,
        };
      }
      return { entries: all, truncated: false };
    },
    enabled: !!projectId,
    staleTime: 30_000,
  });
}
