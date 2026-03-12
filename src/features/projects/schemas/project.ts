import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  description?: string;
}
