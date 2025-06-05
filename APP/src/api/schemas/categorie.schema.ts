import * as z from "zod";

export const categoryFormSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  description: z.string()
    .max(200, "La descripción no puede exceder los 200 caracteres")
    .optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;