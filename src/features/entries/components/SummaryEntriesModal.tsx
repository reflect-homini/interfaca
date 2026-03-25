import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSummaryEntriesQuery } from "../hooks/useSummaryEntriesQuery";
import { format, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  summaryId: string;
  endEntryId: string;
  entriesCount: number;
}

export function SummaryEntriesModal({
  open,
  onOpenChange,
  projectId,
  summaryId,
  endEntryId,
  entriesCount,
}: Readonly<Props>) {
  const {
    data: entries,
    isLoading,
    isError,
  } = useSummaryEntriesQuery(projectId, summaryId, endEntryId, open);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3" data-testid="summary-entries-loading">
          {Array.from({ length: Math.min(entriesCount, 5) }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="glass-panel px-4 py-3 space-y-2"
            >
              <div
                className="skeleton-shimmer rounded h-4"
                style={{ width: `${55 + Math.random() * 35}%` }}
              />
              <div
                className="skeleton-shimmer rounded h-4"
                style={{ width: `${35 + Math.random() * 30}%` }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-8" data-testid="summary-entries-error">
          <p className="text-sm text-destructive">
            Failed to load entries. Please try again.
          </p>
        </div>
      );
    }

    if (entries && entries.length > 0) {
      return (
        <div className="space-y-3" data-testid="summary-entries-list">
          {entries.map((entry) => (
            <div key={entry.id} className="glass-panel px-4 py-3 fade-in">
              <div
                className="text-foreground text-sm leading-relaxed prose prose-sm max-w-none 
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
              <span className="text-[10px] text-muted-foreground/60 mt-2 inline-block">
                {format(parseISO(entry.createdAt), "MMM d, h:mm a")}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-12" data-testid="summary-entries-empty">
        <p className="text-sm text-muted-foreground">
          No reflections found for this summary.
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="font-display">
              Summarized Entries
            </DialogTitle>
            <DialogDescription>
              {entriesCount} {entriesCount === 1 ? "reflection" : "reflections"}{" "}
              included in this summary
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
