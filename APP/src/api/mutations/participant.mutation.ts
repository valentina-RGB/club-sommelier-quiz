import { useMutation } from '@tanstack/react-query';
import AuthClient from '../client/axios';
import { RegisterParticipantData, RegisterParticipantResponse } from '../types/participant.type';

const apiClient = new AuthClient();

export function useRegisterParticipant() {
  return useMutation({
    mutationFn: async ({
      eventCode,
      participantData
    }: {
      eventCode: string;
      participantData: RegisterParticipantData
    }) => {
      try {
        const response = await apiClient.post<RegisterParticipantResponse>(
          `/participants/${eventCode}`,
          participantData
        );
        return response;
      } catch (error) {
        console.error('Error registering participant:', error);
        throw error;
      }
    }
  });
}