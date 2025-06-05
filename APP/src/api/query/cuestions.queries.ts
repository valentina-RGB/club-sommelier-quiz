import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { GetQuestionnaire, ListQuestionnaires } from "@/api/types/quetionnaire.type";


const authClient = new AuthClient();

export const useQuestionnaireQuery = () => {
  return useQuery<ListQuestionnaires[], Error>({
    queryKey: ["Questionnaires"],
    queryFn: async (): Promise<ListQuestionnaires[]> => {
      try {
        const questionData = await authClient.get<{ questionnaires: ListQuestionnaires[] }>(
          "/questionnaires"
        );

        return questionData.questionnaires || [];
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

export const useQuestionnaireByIDQuery = (id: string) => {
  return useQuery<GetQuestionnaire, Error>({
    queryKey: ["Questionnaire", id],
    queryFn: async (): Promise<GetQuestionnaire> => {
      const response = await authClient.get<GetQuestionnaire>(`/questionnaires/${id}`);
      return response;
    },
    enabled: !!id,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

