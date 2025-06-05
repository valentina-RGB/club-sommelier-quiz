import { z } from 'zod';

// Schema for question form
export const questionFormSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  response: z.boolean(),
  level_id: z.number().min(1, "El nivel es requerido"),
  categories: z.array(z.number()).min(1, "Al menos una categoría es requerida"),
});

// Type inference from the schema
export type QuestionFormData = z.infer<typeof questionFormSchema>;

// For creating a new question
export const createQuestionSchema = questionFormSchema;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

// For updating an existing question
export const updateQuestionSchema = questionFormSchema.partial();
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;