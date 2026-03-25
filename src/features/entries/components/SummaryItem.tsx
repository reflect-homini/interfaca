import { useState } from "react";
import { Sparkles, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { Summary } from "@/features/projects/schemas/project";
import { SummaryEntriesModal } from "./SummaryEntriesModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Props {
  summary: Summary;
  projectId: string;
  isNew?: boolean;
}

export function SummaryItem({ summary, projectId, isNew }: Readonly<Props>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
              <ReactMarkdown>{`## Summary\n\n${summary.content}`}</ReactMarkdown>
            </div>

            {summary.additionalContent && (
              <Collapsible
                open={isExpanded}
                onOpenChange={setIsExpanded}
                className="mt-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="tertiary"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> Show details
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 pt-2 border-t border-secondary/10 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
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
                    <ReactMarkdown>{summary.additionalContent}</ReactMarkdown>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

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
        endEntryId={summary.endEntryId}
        entriesCount={summary.entriesCount}
      />
    </>
  );
}
