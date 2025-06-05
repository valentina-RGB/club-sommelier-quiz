export interface Participant {
  name: string;
  email: string;
  phone: string;
}

export interface RegisterParticipantData {
  fullName: string;
  email: string;
  numberPhone: string;
}

export interface RegisterParticipantResponse {
  id: string;
  eventId: number;
  fullName: string;
  email: string;
  numberPhone: string;
  createdAt: string;
}