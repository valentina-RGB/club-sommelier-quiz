import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { Getquestions, question } from "../types/questions.type";


const authClient = new AuthClient();

export const useQuestionsQuery = () => {
  return useQuery<question[], Error>({
    queryKey: ['questions'],
    queryFn: async () => {
      try {
        const response = await authClient.get<Getquestions>('/questions');
        
        const questionData = response.questions|| [];
        
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

/**
 * Hook to fetch a single question by ID
 * @param id The question ID to fetch
 */
export const useQuestionByIDQuery = (id: number | null) => {
  return useQuery<question, Error>({
    queryKey: ['question', id],
    queryFn: async (): Promise<question> => {
      try {
        if (!id) throw new Error('Question ID is required');
        
        const response = await authClient.get<question>(`/questions/${id}`);
        
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

