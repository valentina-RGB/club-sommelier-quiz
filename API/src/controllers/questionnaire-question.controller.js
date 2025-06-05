const QuestionnaireQuestionService = require("../services/questionaire-question.service");

class QuestionnaireQuestionController {
  constructor() {
    this.questionnaireQuestionService = new QuestionnaireQuestionService();
  }

  deleteQuestionnaireQuestion= async (req, res) => {
    try {
      const questionnaire_id = req.body.questionnaire_id;
      const question_id = req.body.question_id;
    
      const result =
        await this.questionnaireQuestionService.deleteQuestionnaireQuestion(
          questionnaire_id,
          question_id
        );
      return res.status(200).json({
        message: "Questionnaire question deleted successfully",
      });
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
      res.status(500).json({ message: "Error deleting Question to Questionnaire", error });
    }
  }
}

module.exports = QuestionnaireQuestionController;
