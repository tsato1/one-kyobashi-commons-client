import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required.").optional(),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional()
});

export type EventFormData = z.infer<typeof eventSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;