import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;

export interface BaseItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  content: string;
}

export interface Entry extends BaseItem {
  itemType: "entry";
}

export interface Summary extends BaseItem {
  itemType: "summary";
  additionalContent: string;
  entriesCount: number;
  endEntryId: string;
}

export type ProjectItem = Entry | Summary;

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  description?: string;
  lastInteractedAt?: string;
  items: ProjectItem[];
}
