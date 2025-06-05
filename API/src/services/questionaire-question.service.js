const questionnaireQuestionRepository = require("../repositories/questionnaire-question.repository");
const questionnaireRepository = require("../repositories/questionnaire.repository");
const questionRepository = require("../repositories/question.repository");

class QuetionnaireQuestionService {
  constructor() {
    this.questionnaireQuestionRepository =
      new questionnaireQuestionRepository();
    this.questionnaireRepository = new questionnaireRepository();
    this.questionRepository = new questionRepository();
  }

  async findByQuestionnaireId(questionnaireId) {
    const questionnaire =
      await this.questionnaireRepository.findById(questionnaireId);

    if (!questionnaire) {
      const error = new Error("Questionnaire no found");
      error.status = 404;
      throw error;
    }

    const questions =
      await this.questionnaireQuestionRepository.findByQuestionnaireId(
        questionnaireId
      );

    return questions;
  }

  async deleteQuestionnaireQuestion(questionnaireId, questionId) {
    const questionnaire =
      await this.questionnaireRepository.findById(questionnaireId);

    if (!questionnaire) {
      const error = new Error("Questionnaire no found");
      error.status = 404;
      throw error;
    }

    const question = await this.questionRepository.findById(questionId);
    console.log("question", question);

    if (!question) {
      const error = new Error("Question no found");
      error.status = 404;
      throw error;
    }


    const result =
      await this.questionnaireQuestionRepository.deleteByQuestionnaireandQuestion(
        questionnaireId,
        questionId
      );

      console.log("result", result);

    return result;
  }
}

module.exports = QuetionnaireQuestionService;
