import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Plus, FolderOpen } from "lucide-react";
import { useProjectsQuery } from "../hooks/useProjectsQuery";

interface CommandPaletteProps {
  onCreateProject: () => void;
}

export function CommandPalette({ onCreateProject }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: projects } = useProjectsQuery();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onCreateProject();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onCreateProject]);

  const lastUpdatedProject = projects
    ? [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              onCreateProject();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new project
          </CommandItem>
          {lastUpdatedProject && (
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate({
                  to: "/projects/$projectId",
                  params: { projectId: lastUpdatedProject.id },
                });
              }}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Open last project — {lastUpdatedProject.name}
            </CommandItem>
          )}
        </CommandGroup>
        {projects && projects.length > 0 && (
          <CommandGroup heading="Projects">
            {projects.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => {
                  setOpen(false);
                  navigate({
                    to: "/projects/$projectId",
                    params: { projectId: p.id },
                  });
                }}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
