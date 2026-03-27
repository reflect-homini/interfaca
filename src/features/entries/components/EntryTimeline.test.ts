import { describe, it, expect } from "vitest";
import { buildTimeline } from "./EntryTimeline";
import type { ProjectItem } from "@/features/projects/schemas/project";

describe("buildTimeline", () => {
  it("should create a day separator and rows in chronological order", () => {
    const items: ProjectItem[] = [
      {
        id: "1",
        itemType: "entry",
        content: "Oldest",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-01T10:00:00Z",
        projectId: "p1",
      },
      {
        id: "2",
        itemType: "entry",
        content: "Newer",
        createdAt: "2024-01-01T10:05:00Z",
        updatedAt: "2024-01-01T10:05:00Z",
        projectId: "p1",
      },
      {
        id: "3",
        itemType: "entry",
        content: "Next Day",
        createdAt: "2024-01-02T10:00:00Z",
        updatedAt: "2024-01-02T10:00:00Z",
        projectId: "p1",
      },
    ];

    const rows = buildTimeline(items);

    expect(rows[0].type).toBe("day-separator");
    expect(rows[1].type).toBe("entry");
    expect((rows[1] as any).item.content).toBe("Oldest");
    expect(rows[2].type).toBe("entry");
    expect((rows[2] as any).item.content).toBe("Newer");
    expect(rows[3].type).toBe("timestamp");

    expect(rows[4].type).toBe("day-separator");
    expect(rows[5].type).toBe("entry");
    expect((rows[5] as any).item.content).toBe("Next Day");
    expect(rows[6].type).toBe("timestamp");
  });

  it("should handle empty items", () => {
    const rows = buildTimeline([]);
    expect(rows).toEqual([]);
  });

  it("should maintain order when a new item is appended", () => {
    const items: ProjectItem[] = [
      {
        id: "1",
        itemType: "entry",
        content: "Oldest",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-01T10:00:00Z",
        projectId: "p1",
      },
    ];
    const rows1 = buildTimeline(items);
    expect(rows1[1].type).toBe("entry");
    expect((rows1[1] as any).item.content).toBe("Oldest");

    const newItems: ProjectItem[] = [
      ...items,
      {
        id: "2",
        itemType: "entry",
        content: "Newest",
        createdAt: "2024-01-01T10:05:00Z",
        updatedAt: "2024-01-01T10:05:00Z",
        projectId: "p1",
      },
    ];
    const rows2 = buildTimeline(newItems);
    expect(rows2[1].type).toBe("entry");
    expect((rows2[1] as any).item.content).toBe("Oldest");
    expect(rows2[2].type).toBe("entry");
    expect((rows2[2] as any).item.content).toBe("Newest");
  });
});
