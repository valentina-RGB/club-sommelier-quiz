
import AuthClient from "@/api/client/axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { DeleteQuestionnaire, GetQuestionnaire, PostQuestionnaire } from "../types/quetionnaire.type";
import { useError } from "@/common/hooks/useErros";

const authClient = new AuthClient();

export const useCreateQuestionnaireMutation = () => {
    const queryClient = useQueryClient();
    const useErrors = useError('questionnaires');

    return useMutation<GetQuestionnaire, Error, PostQuestionnaire>({
        mutationFn: async (questionnaireData): Promise<GetQuestionnaire> => {
            try {
                const response: AxiosResponse<GetQuestionnaire> = await authClient.post('/questionnaires', questionnaireData);
                return response.data;
            } catch (error: any) {
                useErrors(error);
                throw error;
            }
        },
        onSuccess: () => {
            const loadingToast = toast.loading('Creando cuestionario...', { id: "loading-create-questionnaire" });
            toast.success('¡Cuestionario creado con éxito!', { id: loadingToast });
            queryClient.invalidateQueries({ queryKey: ['Questionnaires'] });

        },
        onError: (error: any) => {
            if (error?.statusCode !== 409) {
                console.error(error.message || 'Error al crear el cuestionario');
            }
        }
    });
};


interface UpdateQuestionnaireData {
    id: number;
    data: Partial<PostQuestionnaire>;
}


export const useUpdateQuestionnaireMutation = () => {
    const queryClient = useQueryClient();
    const useErrors = useError('questionnaires');

    return useMutation<GetQuestionnaire, Error, UpdateQuestionnaireData>({
        mutationFn: async ({ id, data }): Promise<GetQuestionnaire> => {
            try {
                const response: AxiosResponse<GetQuestionnaire> = await authClient.patch(`/questionnaires/${id}`, data);
                return response.data;
            } catch (error: any) {
                useErrors(error);
                throw error;
            }
        },
        onSuccess: (data) => {
            const loadingToast = toast.loading('Actualizando cuestionario...', { id: "loading-update-questionnaire" });
            toast.success('¡Cuestionario actualizado con éxito!', { id: loadingToast });

            if (data && data.id) {
                queryClient.invalidateQueries({ queryKey: ['Questionnaire', data.id] });
            }

            queryClient.invalidateQueries({ queryKey: ['Questionnaires'] });
        },
        onError: (error: any) => {
            console.error(error.message || 'Error al actualizar el cuestionario');
        }
    });
};



export const useDeleteQuetionnaireMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, DeleteQuestionnaire>({
        mutationFn: async (data: DeleteQuestionnaire): Promise<any> => {

            try {
                const result = await authClient.delete(`/questionnaire-questions`, data);
                return result;
            }
            catch (error: any) {
                throw error;
            }
        },
        onSuccess: (_, data) => {
            toast.success('Pregunta eliminada con éxito');
            queryClient.invalidateQueries({ queryKey: ['Questionnaire', data.questionnaire_id] });
            queryClient.invalidateQueries({ queryKey: ['Questionnaires'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al eliminar la pregunta');
        }
    });
};