import { useState, useCallback } from "react";
import { Outlet } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ProjectsSidebar } from "../components/ProjectsSidebar";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { CommandPalette } from "../components/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProjectsLayout() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const openModal = useCallback(() => setModalOpen(true), []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300
               ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : "relative w-64 shrink-0"
          }
          bg-sidebar border-r border-sidebar-border
        `}
      >
        <ProjectsSidebar onCreateProject={openModal} />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        {isMobile && (
          <header className="h-12 flex items-center border-b border-border px-3 shrink-0">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>

      <CreateProjectModal open={modalOpen} onOpenChange={setModalOpen} />
      <CommandPalette onCreateProject={openModal} />
    </div>
  );
}
