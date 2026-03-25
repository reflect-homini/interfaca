import { useRef, useEffect, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { differenceInMinutes, parseISO, startOfDay } from "date-fns";
import type { ProjectItem } from "@/features/projects/schemas/project";
import { EntryItem } from "./EntryItem";
import { SummaryItem } from "./SummaryItem";
import { EntryTimestamp } from "./EntryTimestamp";
import { EntryDaySeparator } from "./EntryDaySeparator";

const TIMESTAMP_GAP_MINUTES = 10;

type TimelineRow =
  | { type: "day-separator"; date: Date; key: string }
  | { type: "timestamp"; date: Date; key: string }
  | {
      type: "entry";
      item: ProjectItem & { itemType: "entry" };
      isNew: boolean;
      key: string;
    }
  | {
      type: "summary";
      item: ProjectItem & { itemType: "summary" };
      isNew: boolean;
      key: string;
    };

interface Props {
  projectId: string;
  items: ProjectItem[];
  truncated: boolean;
  lastNewId?: string | null;
}

function buildTimeline(
  items: ProjectItem[],
  lastNewId?: string | null,
): TimelineRow[] {
  const rows: TimelineRow[] = [];
  let prevDate: Date | null = null;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const date = parseISO(item.createdAt);
    const prevDay = prevDate ? startOfDay(prevDate) : null;
    const curDay = startOfDay(date);

    // Day separator
    if (!prevDay || curDay.getTime() !== prevDay.getTime()) {
      rows.push({ type: "day-separator", date: curDay, key: `day-${item.id}` });
    }

    // Timestamp grouping
    const showTimestamp =
      i === 0 ||
      !prevDate ||
      curDay.getTime() !== prevDay?.getTime() ||
      Math.abs(differenceInMinutes(date, prevDate)) >= TIMESTAMP_GAP_MINUTES;

    if (item.itemType === "entry") {
      rows.push({
        type: "entry",
        item,
        isNew: item.id === lastNewId,
        key: `entry-${item.id}`,
      });
    } else {
      rows.push({
        type: "summary",
        item,
        isNew: item.id === lastNewId,
        key: `summary-${item.id}`,
      });
    }

    // Timestamp below
    const nextItem = items[i + 1];
    if (showTimestamp) {
      if (nextItem) {
        const nextDate = parseISO(nextItem.createdAt);
        const nextDay = startOfDay(nextDate);
        const gapToNext = Math.abs(differenceInMinutes(nextDate, date));
        if (
          nextDay.getTime() !== curDay.getTime() ||
          gapToNext >= TIMESTAMP_GAP_MINUTES
        ) {
          rows.push({ type: "timestamp", date, key: `ts-${item.id}` });
        }
      } else {
        rows.push({ type: "timestamp", date, key: `ts-${item.id}` });
      }
    }

    prevDate = date;
  }

  return rows;
}

export function EntryTimeline({
  projectId,
  items,
  truncated,
  lastNewId,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevLengthRef = useRef(items.length);

  const rows = useMemo(
    () => buildTimeline(items, lastNewId),
    [items, lastNewId],
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      if (row.type === "day-separator") return 40;
      if (row.type === "timestamp") return 28;
      if (row.type === "summary") return 120;
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
  }, [rows.length === 0]);

  // Scroll to bottom when new items added and user was at bottom
  useEffect(() => {
    if (items.length > prevLengthRef.current && isAtBottomRef.current) {
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(rows.length - 1, {
          align: "end",
          behavior: "smooth",
        });
      });
    }
    prevLengthRef.current = items.length;
  }, [items.length, rows.length, virtualizer]);

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
                {row.type === "timestamp" && <EntryTimestamp date={row.date} />}
                {row.type === "entry" && (
                  <div className="py-1.5 flex justify-end">
                    <div className="max-w-[85%]">
                      <EntryItem entry={row.item} projectId={projectId} isNew={row.isNew} />
                    </div>
                  </div>
                )}
                {row.type === "summary" && (
                  <div className="py-1.5">
                    <SummaryItem
                      summary={row.item}
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
