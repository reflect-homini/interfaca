import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { updateEntryApi } from "../api/entries";
import { toast } from "sonner";
import type { Entry, Project } from "@/features/projects/schemas/project";

export function useUpdateEntryMutation(projectId: string, entryId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      updateEntryApi(projectId, entryId, content),
    onSuccess: (updatedEntry: Entry) => {
      qc.setQueryData(queryKeys.entries(projectId), (old: Project) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === entryId ? updatedEntry : item,
          ),
        };
      });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      toast.success("Entry updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update entry");
    },
  });
}
