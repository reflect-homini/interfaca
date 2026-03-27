import { z } from "zod";

export const createEntrySchema = z.object({
  content: z.string().trim().min(3, "Entry must be at least 3 characters"),
});

export type CreateEntryValues = z.infer<typeof createEntrySchema>;

export const updateEntrySchema = z.object({
  content: z.string().trim().min(3, "Entry must be at least 3 characters"),
});

export type UpdateEntryValues = z.infer<typeof updateEntrySchema>;
