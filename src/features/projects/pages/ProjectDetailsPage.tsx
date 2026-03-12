import { useParams } from "@tanstack/react-router";
import { useProjectQuery } from "../hooks/useProjectQuery";
import { lastProjectStorage } from "@/lib/lastProject";
import { useEffect } from "react";

export default function ProjectDetailsPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const { data: project, isLoading } = useProjectQuery(projectId);

  useEffect(() => {
    if (projectId) lastProjectStorage.set(projectId);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 fade-in">
        <div className="h-8 w-64 skeleton-shimmer rounded-lg" />
        <div className="h-4 w-96 skeleton-shimmer rounded" />
        <div className="h-48 skeleton-shimmer rounded-xl mt-8" />
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

  return (
    <div className="p-8 max-w-3xl fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display text-foreground">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
        )}
      </div>

      <div className="mt-10 glass-panel p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center pulse-glow">
          <div className="w-5 h-5 rounded-full bg-primary/40" />
        </div>
        <p className="text-muted-foreground text-sm">
          AI-powered reflections and insights will appear here.
        </p>
      </div>
    </div>
  );
}
