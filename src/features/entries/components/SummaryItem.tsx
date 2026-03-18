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
            <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words prose prose-invert prose-sm max-w-none">
              {summary.content}
            </div>

            {summary.entriesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(true)}
                className="mt-3 h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
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
