import { useRef, useEffect, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { differenceInMinutes, parseISO, startOfDay } from "date-fns";
import type { Entry } from "@/features/projects/schemas/project";
import { EntryItem } from "./EntryItem";
import { EntryTimestamp } from "./EntryTimestamp";
import { EntryDaySeparator } from "./EntryDaySeparator";

const TIMESTAMP_GAP_MINUTES = 10;

type TimelineRow =
  | { type: "day-separator"; date: Date; key: string }
  | { type: "timestamp"; date: Date; key: string }
  | { type: "entry"; entry: Entry; isNew: boolean; key: string };

interface Props {
  projectId: string;
  entries: Entry[];
  truncated: boolean;
  lastNewId?: string | null;
}

function buildTimeline(entries: Entry[], lastNewId?: string | null): TimelineRow[] {
  const rows: TimelineRow[] = [];
  let prevDate: Date | null = null;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const date = parseISO(entry.createdAt);
    const prevDay = prevDate ? startOfDay(prevDate) : null;
    const curDay = startOfDay(date);

    // Day separator
    if (!prevDay || curDay.getTime() !== prevDay.getTime()) {
      rows.push({ type: "day-separator", date: curDay, key: `day-${entry.id}` });
    }

    // Timestamp grouping: show if first, different day, or >10min gap
    const showTimestamp =
      i === 0 ||
      !prevDate ||
      curDay.getTime() !== prevDay?.getTime() ||
      Math.abs(differenceInMinutes(date, prevDate)) >= TIMESTAMP_GAP_MINUTES;

    rows.push({
      type: "entry",
      entry,
      isNew: entry.id === lastNewId,
      key: `entry-${entry.id}`,
    });

    // Timestamp appears below the entry (before the next entry or at end of group)
    const nextEntry = entries[i + 1];
    if (showTimestamp) {
      // Show timestamp below current entry if it's the start of a new time group
      if (nextEntry) {
        const nextDate = parseISO(nextEntry.createdAt);
        const nextDay = startOfDay(nextDate);
        const gapToNext = Math.abs(differenceInMinutes(nextDate, date));
        if (nextDay.getTime() !== curDay.getTime() || gapToNext >= TIMESTAMP_GAP_MINUTES) {
          rows.push({ type: "timestamp", date, key: `ts-${entry.id}` });
        }
      } else {
        // Last entry always shows timestamp
        rows.push({ type: "timestamp", date, key: `ts-${entry.id}` });
      }
    }

    prevDate = date;
  }

  return rows;
}

export function EntryTimeline({ projectId, entries, truncated, lastNewId }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevLengthRef = useRef(entries.length);

  const rows = useMemo(() => buildTimeline(entries, lastNewId), [entries, lastNewId]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      if (row.type === "day-separator") return 40;
      if (row.type === "timestamp") return 28;
      return 80;
    },
    overscan: 10,
  });

  // Scroll to bottom on initial load
  useEffect(() => {
    if (rows.length > 0) {
      virtualizer.scrollToIndex(rows.length - 1, { align: "end" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length === 0]); // only on first load

  // Scroll to bottom when new entries added and user was at bottom
  useEffect(() => {
    if (entries.length > prevLengthRef.current && isAtBottomRef.current) {
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(rows.length - 1, { align: "end", behavior: "smooth" });
      });
    }
    prevLengthRef.current = entries.length;
  }, [entries.length, rows.length, virtualizer]);

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const threshold = 100;
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto"
    >
      {truncated && (
        <div className="text-center py-3">
          <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
            Showing the most recent reflections
          </span>
        </div>
      )}

      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={row.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="max-w-3xl mx-auto px-3 sm:px-4">
                {row.type === "day-separator" && (
                  <EntryDaySeparator date={row.date} />
                )}
                {row.type === "timestamp" && (
                  <EntryTimestamp date={row.date} />
                )}
                {row.type === "entry" && (
                  <div className="py-1.5">
                    <EntryItem
                      entry={row.entry}
                      projectId={projectId}
                      isNew={row.isNew}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
