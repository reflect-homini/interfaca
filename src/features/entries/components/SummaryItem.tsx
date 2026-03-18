import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { Summary } from "@/features/projects/schemas/project";
import { SummaryEntriesModal } from "./SummaryEntriesModal";

interface Props {
  summary: Summary;
  projectId: string;
  isNew?: boolean;
}

export function SummaryItem({ summary, projectId, isNew }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`flex gap-3 items-start max-w-[85%] ${isNew ? "slide-up" : "fade-in"}`}
      >
        {/* AI avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
          <Sparkles className="w-4 h-4 text-secondary" />
        </div>

        {/* Bubble */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1 block">
            AI Insight
          </span>
          <div className="glass-panel px-4 py-3 border-secondary/20 bg-secondary/5">
            <div
              className="text-foreground text-sm leading-relaxed prose prose-sm max-w-none 
              dark:prose-invert
              prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground
              prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
              prose-p:text-foreground prose-p:my-1.5
              prose-ul:list-disc prose-ul:pl-4 prose-ul:my-2
              prose-ol:list-decimal prose-ol:pl-4 prose-ol:my-2
              prose-li:text-foreground prose-li:my-0.5
              prose-code:text-secondary prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border prose-pre:text-foreground
              prose-strong:text-foreground prose-a:text-primary"
            >
              <ReactMarkdown>{summary.content}</ReactMarkdown>
            </div>

            {summary.entriesCount > 0 && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setModalOpen(true)}
                className="mt-3 h-7 px-2 text-xs gap-1"
              >
                Show {summary.entriesCount}{" "}
                {summary.entriesCount === 1 ? "entry" : "entries"}
                <ChevronRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <SummaryEntriesModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projectId={projectId}
        summaryId={summary.id}
        entriesCount={summary.entriesCount}
      />
    </>
  );
}
