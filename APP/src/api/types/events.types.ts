import { GetQuestionnaire } from "./quetionnaire.type";

export interface PostEvent {
  name: string,
  start_time: string,
  questionnaire_id: number
  end_time: string
}

export interface EventDetail {
  id: number;
  name: string;
  access_code: string;
  questionnaire_id: number;
  start_time: string;
  end_time: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  questionnaire?: GetQuestionnaire;
}


