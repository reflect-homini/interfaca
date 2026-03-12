import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createProjectSchema } from "../schemas/project";
import { useCreateProjectMutation } from "../hooks/useCreateProjectMutation";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const form = useForm({
    defaultValues: { name: "", description: "" },
    onSubmit: async ({ value }) => {
      const result = createProjectSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((e) => toast.error(e.message));
        return;
      }
      mutation.mutate(result.data);
    },
  });

  const mutation = useCreateProjectMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            New Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new project to organize your reflections.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 mt-2"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor="project-name"
                  className="text-sm font-medium text-foreground"
                >
                  Project Name
                </label>
                <input
                  id="project-name"
                  autoFocus
                  className="glow-input w-full"
                  placeholder="e.g. Career Transition"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor="project-desc"
                  className="text-sm font-medium text-foreground"
                >
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="project-desc"
                  className="glow-input w-full min-h-[80px] resize-none"
                  placeholder="What is this project about?"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
