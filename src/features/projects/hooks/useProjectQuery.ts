import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProjectApi } from "../api/projects";

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => getProjectApi(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}
