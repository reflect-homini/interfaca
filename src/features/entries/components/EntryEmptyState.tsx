import { Sparkles } from "lucide-react";

export function EntryEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 fade-in">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center pulse-glow">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-display font-semibold text-foreground">
          Start your first reflection
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          What did you work on today? Use the input below to capture your
          thoughts, progress, and insights.
        </p>
      </div>
    </div>
  );
}
