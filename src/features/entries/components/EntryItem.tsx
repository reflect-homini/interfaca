import ReactMarkdown from "react-markdown";
import type { Entry } from "@/features/projects/schemas/project";

interface Props {
  entry: Entry;
  isNew?: boolean;
}

export function EntryItem({ entry, isNew }: Readonly<Props>) {
  return (
    <div
      className={`group glass-panel px-5 py-4 transition-all duration-300 hover:border-primary/20 relative ${
        isNew ? "slide-up" : "fade-in"
      }`}
    >
      <div
        className="text-foreground leading-relaxed text-sm prose prose-sm max-w-none 
          dark:prose-invert
          prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground
          prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
          prose-p:text-foreground prose-p:my-1.5
          prose-ul:list-disc prose-ul:pl-4 prose-ul:my-2
          prose-ol:list-decimal prose-ol:pl-4 prose-ol:my-2
          prose-li:text-foreground prose-li:my-0.5
          prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border prose-pre:text-foreground
          prose-strong:text-foreground prose-a:text-primary"
      >
        <ReactMarkdown>{entry.content}</ReactMarkdown>
      </div>
    </div>
  );
}
