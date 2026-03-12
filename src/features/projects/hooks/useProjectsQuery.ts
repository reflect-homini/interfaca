import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProjectsApi } from "../api/projects";

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: getProjectsApi,
    staleTime: 2 * 60 * 1000,
  });
}
