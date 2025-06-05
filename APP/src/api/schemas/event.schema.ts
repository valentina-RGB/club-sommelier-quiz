import { z } from 'zod';


export const eventFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  start_time: z.string().min(1, "La hora de inicio es requerida"),
  end_date: z.string().min(1, "La fecha de fin es requerida"),
  end_time: z.string().min(1, "La hora de fin es requerida"),
}).refine(data => {
  const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
  const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
  return endDateTime > startDateTime;
}, {
  message: "La fecha de finalización debe ser posterior a la fecha de inicio",
  path: ["end_date"]
});


export type EventFormData = z.infer<typeof eventFormSchema>;

export const formatToDateInput = (isoString?: string): string => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

export const formatToTimeInput = (isoString?: string): string => {
  if (!isoString) return '';
  return isoString.split('T')[1].substring(0, 5);
};