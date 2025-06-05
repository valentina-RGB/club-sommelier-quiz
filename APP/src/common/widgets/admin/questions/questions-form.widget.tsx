"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { questionFormSchema, QuestionFormData } from "@/api/schemas/questions.schema"
import { useCategoriesQuery } from "@/api/query/category.queries"
import { useNivelesQuery } from "@/api/query/level.queries"
import { question } from "@/api/types/questions.type"
import FormQuestion from "@/common/molecules/admin/questions/form-question.molecule"

interface QuestionFormProps {
  initialData?: question | null;
  isEditing?: boolean;
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function QuestionForm({initialData, isEditing = false, onSubmit, onCancel, isSubmitting = false}: QuestionFormProps) {
    
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery();
  const { data: nivels = [], isLoading: isLoadingNiveles } = useNivelesQuery();
  
  // Helper to get level_id from level name
  const getLevelIdFromName = (levelName?: string): number => {
    if (!levelName) return 1;
    
    // Find the level ID from the fetched niveles data
    const foundLevel = nivels.find(nivel => nivel.name === levelName);
    return foundLevel?.id || 1;
  };

  // Form setup with zod schema
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData ? {
      question: initialData.question,
      response: initialData.response,
      level_id: getLevelIdFromName(initialData.level),
      categories: initialData.categories.map(cat => cat.id)
    } : {
      question: "",
      response: false,
      level_id: nivels[0]?.id || 1,
      categories: []
    }
  });

  // Reset form when initialData or niveles change
  useEffect(() => {
    if (initialData) {
      form.reset({
        question: initialData.question,
        response: initialData.response,
        level_id: getLevelIdFromName(initialData.level),
        categories: initialData.categories.map(cat => cat.id)
      });
    } else {
      form.reset({
        question: "",
        response: false,
        level_id: nivels[0]?.id || 1,
        categories: []
      });
    }
  }, [form, initialData, nivels]);

  const handleSubmit = (data: QuestionFormData) => {
    onSubmit(data);
  };

  return (
    <FormQuestion
    form={form}
    isEditing={isEditing}
    isLoadingCategories={isLoadingCategories}
    isSubmitting={isSubmitting}
    isLoadingNiveles={isLoadingCategories}
    nivels={nivels}
    categories={categories}
    onCancel={onCancel}
    handleSubmit={handleSubmit}
    ></FormQuestion>
  );
}