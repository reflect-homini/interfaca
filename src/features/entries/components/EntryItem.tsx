import type { Entry } from "@/features/projects/schemas/project";

interface Props {
  entry: Entry;
  isNew?: boolean;
}

export function EntryItem({ entry, isNew }: Props) {
  return (
    <div
      className={`group glass-panel px-5 py-4 transition-all duration-300 hover:border-primary/20 ${
        isNew ? "slide-up" : "fade-in"
      }`}
    >
      <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words text-sm">
        {entry.content}
      </p>
    </div>
  );
}
