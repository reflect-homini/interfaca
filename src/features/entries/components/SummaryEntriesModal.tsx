import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSummaryEntriesQuery } from "../hooks/useSummaryEntriesQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  summaryId: string;
  entriesCount: number;
}

export function SummaryEntriesModal({
  open,
  onOpenChange,
  projectId,
  summaryId,
  entriesCount,
}: Props) {
  const { data: entries, isLoading, isError } = useSummaryEntriesQuery(
    projectId,
    summaryId,
    open,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">
            Summarized Entries
          </DialogTitle>
          <DialogDescription>
            {entriesCount} {entriesCount === 1 ? "reflection" : "reflections"} included in this summary
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {isLoading && (
            <div className="space-y-3 py-2">
              {Array.from({ length: Math.min(entriesCount, 5) }).map((_, i) => (
                <div key={i} className="glass-panel px-4 py-3 space-y-2">
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
          )}

          {isError && (
            <div className="text-center py-8">
              <p className="text-sm text-destructive">
                Failed to load entries. Please try again.
              </p>
            </div>
          )}

          {entries && (
            <div className="space-y-2 py-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="glass-panel px-4 py-3 fade-in"
                >
                  <div className="text-foreground text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary">
                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 mt-2 inline-block">
                    {format(parseISO(entry.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
