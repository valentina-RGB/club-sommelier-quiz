import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { Nivel } from "../types/nivel.type";

const authClient = new AuthClient();


export const useNivelesQuery = () => {
  return useQuery<Nivel[], Error>({
    queryKey: ['niveles'],
    queryFn: async (): Promise<Nivel[]> => {
      try {
        const response = await authClient.get<{ niveles: Nivel[] }>('/levels');
        
        if (!Array.isArray(response)) {
          return [];
        }
      
        return response;
      } catch (error) {
        throw error; 
      }
    },
    refetchOnWindowFocus: true,
    retry: 1
  });
};

/**
 * Hook to fetch a nivel by ID
 * @param id The nivel ID to fetch
 */
export const useNivelByIDQuery = (id: number | null) => {
  return useQuery<Nivel, Error>({
    queryKey: ['nivel', id],
    queryFn: async (): Promise<Nivel> => {
      try {
        if (!id) throw new Error('Nivel ID is required');
        
        const response = await authClient.get<Nivel>(`/levels/${id}`);
        
        return response;
      } catch (error) {
        throw error; 
      }
    },
    enabled: !!id, 
    refetchOnWindowFocus: true,
    retry: 1
  });
};