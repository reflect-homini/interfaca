import { Plus } from "lucide-react";

interface ProjectOnboardingProps {
  onCreateProject: () => void;
}

export function ProjectOnboarding({ onCreateProject }: ProjectOnboardingProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center auth-gradient-bg p-4">
      <div className="glass-panel p-12 text-center space-y-8 max-w-lg w-full slide-up">
        {/* AI glow orb */}
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center pulse-glow">
          <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold font-display text-foreground">
            What are you working on right now?
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Projects help you organize your reflections and insights. Create
            your first project to get started with AI-powered journaling.
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5 pulse-glow"
        >
          <Plus className="w-5 h-5" />
          Start a Project
        </button>
      </div>
    </div>
  );
}
