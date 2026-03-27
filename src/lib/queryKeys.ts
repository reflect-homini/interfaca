export const queryKeys = {
  me: ["me"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  entries: (projectId: string) => ["entries", projectId] as const,
  summaryEntries: (summaryId: string) => ["summaryEntries", summaryId] as const,
};
