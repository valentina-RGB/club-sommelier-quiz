import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { Getcategories } from "../types/categories.type";


const authClient = new AuthClient();

export const useCategoriesQuery = () => {
  return useQuery<Getcategories[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await authClient.get<Getcategories[]>('/categories');
        
        const questionData = response|| [];
        
        if (!Array.isArray(questionData)) {
          return [];
        }
        return questionData;
      } catch (error) {
        throw error; 
      }
    },
    refetchOnWindowFocus: true,
    retry: 1
  });
};

