import { useParams } from "@tanstack/react-router";
import { useProjectQuery } from "../hooks/useProjectQuery";
import { useEntriesQuery } from "@/features/entries/hooks/useEntriesQuery";
import { useCreateEntryMutation } from "@/features/entries/hooks/useCreateEntryMutation";
import { EntryTimeline } from "@/features/entries/components/EntryTimeline";
import { EntryInput } from "@/features/entries/components/EntryInput";
import { EntryEmptyState } from "@/features/entries/components/EntryEmptyState";
import { EntrySkeleton } from "@/features/entries/components/EntrySkeleton";
import { lastProjectStorage } from "@/lib/lastProject";
import { useEffect, useRef } from "react";

export default function ProjectDetailsPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const { data: project, isLoading: projectLoading } = useProjectQuery(projectId);
  const { data: entriesData, isLoading: entriesLoading } = useEntriesQuery(projectId);
  const createEntry = useCreateEntryMutation(projectId);
  const lastNewIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (projectId && projectId !== "undefined") {
      lastProjectStorage.set(projectId);
    }
  }, [projectId]);

  const handleSubmit = (content: string) => {
    createEntry.mutate(content, {
      onSuccess: (entry) => {
        lastNewIdRef.current = entry.id;
      },
    });
  };

  if (projectLoading || entriesLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 border-b border-border shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="h-7 w-48 skeleton-shimmer rounded-lg" />
            <div className="h-4 w-72 skeleton-shimmer rounded mt-2" />
          </div>
        </div>
        <EntrySkeleton />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  const entries = entriesData?.entries ?? [];
  const truncated = entriesData?.truncated ?? false;
  const hasEntries = entries.length > 0;

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Project header */}
      <div className="p-4 sm:p-6 border-b border-border shrink-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground truncate">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Timeline or empty state */}
      {hasEntries ? (
        <EntryTimeline
          entries={entries}
          truncated={truncated}
          lastNewId={lastNewIdRef.current}
        />
      ) : (
        <EntryEmptyState />
      )}

      {/* Input */}
      <EntryInput onSubmit={handleSubmit} isPending={createEntry.isPending} />
    </div>
  );
}
