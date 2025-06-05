
export interface QuestionnaireQuestion {
    id: number;
    question: string;
    response: boolean;
    position: number;
    levelName: string;
}


export interface GetQuestionnaire {
    id: number;
    title: string;
    description: string;
    categories: { id: number, name: string }[];
    questions?: QuestionnaireQuestion[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ListQuestionnaires {
    id: number;
    title: string;
    description: string;
    categories: { id: number, name: string }[];
}

export interface PostQuestionnaire {
    title: string;
    description: string;
    categories: number[];
    questions: number[];
}


export interface DeleteQuestionnaire {
	questionnaire_id:number,
	question_id:number

}