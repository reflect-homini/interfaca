import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { createProjectApi } from "../api/projects";
import { lastProjectStorage } from "@/lib/lastProject";
import { ApiError } from "@/api/client";
import type { CreateProjectValues } from "../schemas/project";

export function useCreateProjectMutation(opts?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: CreateProjectValues) => createProjectApi(values),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      lastProjectStorage.set(project.id);
      opts?.onSuccess?.();
      navigate({ to: "/projects/$projectId", params: { projectId: project.id } });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unexpected error occurred");
      }
    },
  });
}
