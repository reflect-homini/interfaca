import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { useUpdateEntryMutation } from "../hooks/useUpdateEntryMutation";
import { useDeleteEntryMutation } from "../hooks/useDeleteEntryMutation";
import type { Entry } from "@/features/projects/schemas/project";

interface Props {
  entry: Entry;
  projectId: string;
  isNew?: boolean;
  onHeightChange?: () => void;
}

export function EntryItem({ entry, projectId, isNew, onHeightChange }: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(entry.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateMutation = useUpdateEntryMutation(projectId, entry.id);
  const deleteMutation = useDeleteEntryMutation(projectId, entry.id);

  const isMutating = updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (isEditing) {
      setDraftContent(entry.content);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length,
        );
      });
    }
  }, [isEditing, entry.content]);

  useEffect(() => {
    onHeightChange?.();
  }, [isEditing, onHeightChange]);

  const handleSave = useCallback(() => {
    const trimmed = draftContent.trim();
    if (trimmed.length < 3 || trimmed === entry.content) {
      setIsEditing(false);
      return;
    }
    updateMutation.mutate(trimmed, {
      onSuccess: () => setIsEditing(false),
    });
  }, [draftContent, entry.content, updateMutation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    },
    [handleSave],
  );

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  }, [deleteMutation]);

  const isValidDraft = draftContent.trim().length >= 3;

  return (
    <>
      <div
        className={`group glass-panel px-5 py-4 transition-all duration-300 hover:border-primary/20 relative ${
          isNew ? "slide-up" : "fade-in"
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none text-sm bg-background/50 border-border/50 focus:border-primary/30"
              disabled={updateMutation.isPending}
            />
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={updateMutation.isPending}
                className="h-7 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending || !isValidDraft}
                className="h-7 px-2 text-xs"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className="text-foreground leading-relaxed text-sm prose prose-sm max-w-none 
                dark:prose-invert
                prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground
                prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
                prose-p:text-foreground prose-p:my-1.5
                prose-ul:list-disc prose-ul:pl-4 prose-ul:my-2
                prose-ol:list-decimal prose-ol:pl-4 prose-ol:my-2
                prose-li:text-foreground prose-li:my-0.5
                prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border prose-pre:text-foreground
                prose-strong:text-foreground prose-a:text-primary"
            >
              <ReactMarkdown>{entry.content}</ReactMarkdown>
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing(true)}
                disabled={isMutating}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isMutating}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This entry will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
