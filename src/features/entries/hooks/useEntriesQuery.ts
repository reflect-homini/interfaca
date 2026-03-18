import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProjectApi } from "@/features/projects/api/projects";
import type { ProjectItem } from "@/features/projects/schemas/project";

const MAX_RENDERED_ITEMS = 500;

export function useEntriesQuery(projectId: string) {
  return useQuery({
    queryKey: queryKeys.entries(projectId),
    queryFn: async (): Promise<{ items: ProjectItem[]; truncated: boolean }> => {
      const project = await getProjectApi(projectId);
      const all = project.items ?? [];
      if (all.length > MAX_RENDERED_ITEMS) {
        return {
          items: all.slice(all.length - MAX_RENDERED_ITEMS),
          truncated: true,
        };
      }
      return { items: all, truncated: false };
    },
    enabled: !!projectId,
    staleTime: 30_000,
  });
}
