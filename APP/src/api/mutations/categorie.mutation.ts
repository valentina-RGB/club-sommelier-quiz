import AuthClient from "@/api/client/axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { PostCategorie, Getcategories } from "@/api/types/categories.type";
import { useError } from "@/common/hooks/useErros";

const authClient = new AuthClient();

export const useCreateCategorieMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Getcategories, Error, PostCategorie>({
        mutationFn: async (categorieData): Promise<Getcategories> => {
            const useErrors = useError('categories');
            try {
                console.log('Creating category with data:', categorieData);
                const response: AxiosResponse<Getcategories> = await authClient.post('/categories', categorieData);
                return response.data;
            } catch (error: any) {
                useErrors(error);
                throw error;
            }
        },
        onSuccess: () => {
            const loadingToast = toast.loading('Creando categoría...', { id: "loading-create-category" });
            toast.success('¡Categoría creada con éxito!', { id: loadingToast });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            if (error?.statusCode !== 409) {
                console.error('Error al crear la categoría:', error);
            }
        }
    });
};

interface UpdateCategorieData {
    id: number;
    data: Partial<PostCategorie>;
}

export const useUpdateCategorieMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Getcategories, Error, UpdateCategorieData>({
        mutationFn: async ({ id, data }): Promise<Getcategories> => {
            try {
                const response: AxiosResponse<Getcategories> = await authClient.put(`/categories/${id}`, data);
                return response.data;
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: (data) => {
            const loadingToast = toast.loading('Actualizando categoría...', { id: "loading-update-category" });
            toast.success('¡Categoría actualizada con éxito!', { id: loadingToast });

            if (data && data.id) {
                queryClient.invalidateQueries({ queryKey: ['category', data.id] });
            }
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar la categoría');
        }
    });
};

export const useDeleteCategorieMutation = () => {
    const useErrors = useError('categories');
    const queryClient = useQueryClient();
    return useMutation<void, Error, number>({
        mutationFn: async (id: number): Promise<void> => {
            await authClient.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            toast.success('Categoría eliminada con éxito');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            useErrors(error);
        }
    });
};