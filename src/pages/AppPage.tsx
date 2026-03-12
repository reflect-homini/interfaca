import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { useProjectsQuery } from "@/features/projects/hooks/useProjectsQuery";
import { ProjectOnboarding } from "@/features/projects/components/ProjectOnboarding";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { lastProjectStorage } from "@/lib/lastProject";
import { ProcessingSkeleton } from "@/components/AuthSkeleton";

export default function AppPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjectsQuery();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isLoading || !projects) return;

    if (projects.length === 0) return; // show onboarding

    // Try last project first
    const lastId = lastProjectStorage.get();
    if (lastId && projects.some((p) => p.id === lastId)) {
      navigate({ to: "/projects/$projectId", params: { projectId: lastId } });
      return;
    }

    // Navigate to most recently updated
    const sorted = [...projects].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    navigate({ to: "/projects/$projectId", params: { projectId: sorted[0].id } });
  }, [isLoading, projects, navigate]);

  if (isLoading) {
    return <ProcessingSkeleton message="Loading" />;
  }

  if (projects && projects.length === 0) {
    return (
      <>
        <ProjectOnboarding onCreateProject={() => setModalOpen(true)} />
        <CreateProjectModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  // Redirecting...
  return <ProcessingSkeleton message="Loading" />;
}
