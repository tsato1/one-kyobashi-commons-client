import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required.").optional(),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional()
});
export type EventFormData = z.infer<typeof eventSchema>;

export const meetingSchema = z.object({
  visibility: z.enum(["Public", "Private"]).optional(),
  startDate: z.date().min(new Date(), "Start date must be in the future").optional(),
  endDate: z.date().optional().nullable(),
  location: z.string().min(1, { message: "Location is required" }).optional(),
  description: z.string().optional().nullable(),
  allowedRoles: z.array(z.enum(["Crew", "Trustee"])).optional(),
});
export type MeetingFormData = z.infer<typeof meetingSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
});
export type SettingsFormData = z.infer<typeof settingsSchema>;