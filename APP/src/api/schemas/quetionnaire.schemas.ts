import { z } from 'zod';

export const questionnaireFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  categories: z.array(z.number()).min(1, "Debe seleccionar al menos una categoría"),
  questions: z.array(z.number()).min(1, "Debe seleccionar al menos una pregunta")
});

export type QuestionnaireFormData = z.infer<typeof questionnaireFormSchema>;