import { useRef, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateEntrySchema } from "../schemas/entry";
import { useUpdateEntryMutation } from "../hooks/useUpdateEntryMutation";

interface EntryEditFormProps {
  projectId: string;
  entryId: string;
  initialContent: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EntryEditForm({
  projectId,
  entryId,
  initialContent,
  onCancel,
  onSuccess,
}: EntryEditFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mutation = useUpdateEntryMutation(projectId, entryId);

  const form = useForm({
    defaultValues: { content: initialContent },
    onSubmit: async ({ value }) => {
      const result = updateEntrySchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((e) => toast.error(e.message));
        return;
      }
      mutation.mutate(result.data.content, {
        onSuccess: () => {
          onSuccess();
        },
      });
    },
  });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-2"
    >
      <form.Field name="content">
        {(field) => (
          <textarea
            ref={textareaRef}
            value={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            onBlur={field.handleBlur}
            disabled={mutation.isPending}
            className="glow-input w-full resize-none min-h-[44px] max-h-[200px] text-sm leading-relaxed"
            placeholder="Entry content..."
          />
        )}
      </form.Field>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending}
          className="h-8"
        >
          {mutation.isPending ? (
            <>
              <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Saving
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="h-8"
        >
          Cancel
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          Press Enter to save, Esc to cancel
        </span>
      </div>
    </form>
  );
}
