import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { deleteEntryApi } from "../api/entries";
import { toast } from "sonner";
import { Project } from "@/features/projects/schemas/project";

export function useDeleteEntryMutation(projectId: string, entryId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteEntryApi(projectId, entryId),
    onSuccess: () => {
      qc.setQueryData(queryKeys.entries(projectId), (old: Project) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.id !== entryId),
        };
      });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      toast.success("Entry deleted");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete entry");
    },
  });
}
