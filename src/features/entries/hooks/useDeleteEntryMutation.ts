import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { deleteEntryApi } from "../api/entries";
import { toast } from "sonner";
import type { Entry } from "@/features/projects/schemas/project";

export function useDeleteEntryMutation(projectId: string, entryId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteEntryApi(projectId, entryId),
    onSuccess: () => {
      qc.setQueryData(queryKeys.entries(projectId), (old: { entries: Entry[]; truncated: boolean } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          entries: old.entries.filter((entry) => entry.id !== entryId),
        };
      });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete entry");
    },
  });
}
