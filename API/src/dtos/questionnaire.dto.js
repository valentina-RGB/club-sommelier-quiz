class QuestionnaireDTO {
    constructor(questionnaire) {
        this.id = questionnaire.id;
        this.title = questionnaire.title;
        this.description = questionnaire.description;
        this.categories = questionnaire.categories?.map(category => ({
            id: category.id,
            name: category.name
        })) || [];
    }
}
class QuestionnaireAndQuestionsDTO {
    constructor(questionnaire) {
        this.id = questionnaire.id;
        this.title = questionnaire.title;
        this.description = questionnaire.description;
        this.questions = questionnaire.questions?.map(question => ({
            id: question.id,
            question: question.question,
            response: question.response,
            position: question.questionnaire_questions.position,
            levelName: question.level.name
        })) || [];
        this.categories = questionnaire.categories ? questionnaire.categories.map(category => ({
            id: category.id,
            name: category.name
        })) : [];
    }
}

class ListQuestionnairesDTO {
    constructor(questionnaires) {
        this.questionnaires = questionnaires.map(questionnaire => new QuestionnaireDTO(questionnaire));
    }
}

module.exports = { QuestionnaireAndQuestionsDTO, ListQuestionnairesDTO };