import { useMemo } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Plus, MoreHorizontal, FolderOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectsQuery } from "../hooks/useProjectsQuery";
import { SidebarSkeleton } from "./SidebarSkeleton";
import type { Project } from "../schemas/project";

const MAX_VISIBLE_PROJECTS = 8;

interface ProjectsSidebarProps {
  onCreateProject: () => void;
  onClose?: () => void;
}

export function ProjectsSidebar({
  onCreateProject,
  onClose,
}: Readonly<ProjectsSidebarProps>) {
  const { data: projects, isLoading } = useProjectsQuery();
  const params = useParams({ strict: false }) as { projectId?: string };

  const visibleProjects = useMemo(
    () => (projects ?? []).slice(0, MAX_VISIBLE_PROJECTS),
    [projects],
  );
  const overflowProjects = useMemo(
    () => (projects ?? []).slice(MAX_VISIBLE_PROJECTS),
    [projects],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-4 border-b border-border/50">
        <Link
          to="/app"
          onClick={onClose}
          className="flex items-center gap-2 px-2"
        >
          <h2 className="text-lg font-bold font-display text-primary tracking-tight">
            Reflect<span className="text-foreground">AI</span>
          </h2>
        </Link>
      </div>

      {/* New Project Button */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={onCreateProject}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                     text-muted-foreground hover:text-foreground hover:bg-muted/50
                     transition-all duration-200 group"
        >
          <Plus className="w-4 h-4 text-primary group-hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)] transition-all duration-200" />
          New Project
        </button>
      </div>

      {/* Project List */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5" role="list">
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <>
            {visibleProjects.map((project) => (
              <ProjectLink
                key={project.id}
                project={project}
                isActive={params.projectId === project.id}
                onClose={onClose}
              />
            ))}

            {overflowProjects.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                                     text-muted-foreground hover:text-foreground hover:bg-muted/50
                                     transition-colors duration-200"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    {overflowProjects.length} more projects
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-56 bg-popover border-border"
                >
                  {overflowProjects.map((project) => (
                    <DropdownMenuItem key={project.id} asChild>
                      <Link
                        to="/projects/$projectId"
                        params={{ projectId: project.id }}
                        className="cursor-pointer"
                        onClick={onClose}
                      >
                        <FolderOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </nav>
    </div>
  );
}

function ProjectLink({
  project,
  isActive,
  onClose,
}: Readonly<{
  project: Project;
  isActive: boolean;
  onClose?: () => void;
}>) {
  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      onClick={onClose}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 group
        ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      role="listitem"
    >
      <FolderOpen
        className={`w-4 h-4 shrink-0 transition-colors duration-200
        ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
      />
      <span className="truncate">{project.name}</span>
    </Link>
  );
}
