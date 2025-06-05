
import { Getcategories } from "./categories.type"

export interface Getquestions {
questions: question[]
}

export interface question{
    id: number
    question: string,
    response: boolean,
    level: string,
    categories: Getcategories[]
}

export interface Postquestion {
    question: string;
    response: boolean;
    level_id: number;
    categories: number[];
}


