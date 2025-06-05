import AuthClient from "@/api/client/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { Postquestion, question } from "@/api/types/questions.type";

const authClient = new AuthClient();

export const useCreateQuestionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<question, Error, Postquestion>({
        mutationFn: async (questionData): Promise<question> => {
            try {
                const response: AxiosResponse<question> = await authClient.post('/questions', questionData);
                return response.data;
            } catch (error: any) {
                if (error?.response?.status === 409) {
                    const conflictError = new Error(error.response?.data?.message || 'Question conflict');
                    (conflictError as any).statusCode = 409;
                    (conflictError as any).message = error.response?.data?.message || 'Question already exists';
                    throw conflictError;
                }

                throw error;
            }
        },
        onSuccess: () => {
            const loadingToast = toast.loading('Creando pregunta...', { id: "loading-create-question" });
            toast.success('¡Pregunta creada con éxito!', { id: loadingToast });
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
        onError: (error: any) => {
            if (error?.statusCode !== 409) {
                toast.error(error.message || 'Error al crear la pregunta');
            }
        }
    });
};

/**
 * Interface for update question data with ID
 */
interface UpdateQuestionData {
    id: number;
    data: Partial<Postquestion>;
}

/**
 * Mutation hook for updating an existing question
 */
export const useUpdateQuestionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<question, Error, UpdateQuestionData>({
        mutationFn: async ({ id, data }): Promise<question> => {
            try {
                const response: AxiosResponse<question> = await authClient.put(`/questions/${id}`, data);
                return response.data;
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: (data) => {
            const loadingToast = toast.loading('Actualizando pregunta...', { id: "loading-update-question" });
            toast.success('¡Pregunta actualizada con éxito!', { id: loadingToast });

            // Invalidate both the list and the specific question
            if (data && data.id) {
                queryClient.invalidateQueries({ queryKey: ['question', data.id] });
            }
            
            // Always invalidate the questions list
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar la pregunta');
        }
    });
};

// Add delete question mutation
export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  const authClient = new AuthClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await authClient.delete(`/questions/${id}`);
    },
    onSuccess: () => {
      const loadingToast = toast.loading('Eliminando pregunta...', { id: "loading-delete-question" });
      toast.success('¡Pregunta eliminada con éxito!', { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la pregunta');
    }
  });
};