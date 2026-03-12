import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteEntryMutation } from "../hooks/useDeleteEntryMutation";

interface EntryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  entryId: string;
  onSuccess?: () => void;
}

export function EntryDeleteDialog({
  open,
  onOpenChange,
  projectId,
  entryId,
  onSuccess,
}: EntryDeleteDialogProps) {
  const mutation = useDeleteEntryMutation(projectId, entryId);

  const handleDelete = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This reflection will be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {mutation.isPending ? (
              <>
                <span className="w-3 h-3 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin mr-2" />
                Deleting
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
