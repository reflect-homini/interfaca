import { useState } from "react";
import { parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";
import type { Entry } from "@/features/projects/schemas/project";
import { EntryActionsMenu } from "./EntryActionsMenu";
import { EntryEditForm } from "./EntryEditForm";
import { EntryDeleteDialog } from "./EntryDeleteDialog";

interface Props {
  entry: Entry;
  projectId: string;
  isNew?: boolean;
}

export function EntryItem({ entry, projectId, isNew }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isEdited = parseISO(entry.updatedAt) > parseISO(entry.createdAt);

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);
  const handleSuccessEdit = () => setIsEditing(false);

  const handleDelete = () => setDeleteDialogOpen(true);
  const handleDeleteSuccess = () => {
    setIsDeleting(true);
  };

  if (isEditing) {
    return (
      <div
        className={`glass-panel px-5 py-4 transition-all duration-300 border-primary/30 bg-primary/5 ${
          isNew ? "slide-up" : "fade-in"
        }`}
      >
        <EntryEditForm
          projectId={projectId}
          entryId={entry.id}
          initialContent={entry.content}
          onCancel={handleCancelEdit}
          onSuccess={handleSuccessEdit}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={`group glass-panel px-5 py-4 transition-all duration-300 hover:border-primary/20 relative ${
          isNew ? "slide-up" : "fade-in"
        } ${isDeleting ? "animate-out fade-out-0 slide-out-to-top-2 duration-300" : ""}`}
      >
        <div className="absolute top-3 right-3">
          <EntryActionsMenu onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        <div className="text-foreground leading-relaxed text-sm pr-8 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary">
          <ReactMarkdown>{entry.content}</ReactMarkdown>
        </div>

        {isEdited && (
          <span className="text-[10px] text-muted-foreground/60 mt-2 inline-block">
            edited
          </span>
        )}
      </div>

      <EntryDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectId={projectId}
        entryId={entry.id}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
