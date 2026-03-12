import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { createEntryApi } from "../api/entries";
import { toast } from "sonner";

export function useCreateEntryMutation(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createEntryApi(projectId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.entries(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create entry");
    },
  });
}
