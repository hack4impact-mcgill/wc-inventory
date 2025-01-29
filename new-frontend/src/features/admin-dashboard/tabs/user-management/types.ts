import { z } from "zod";

export const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
  role: z.enum(["admin", "volunteer"] as const),
});

export type UserFormData = z.infer<typeof userFormSchema>;
