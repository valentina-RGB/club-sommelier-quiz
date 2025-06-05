const {
  QuestionnaireCategory,
} = require("../models/questionnaire-categories.model");

class QuestionnaireCategoryRepository {
  async create(data) {
    return await QuestionnaireCategory.create(data);
  }

  async findAll() {
    return await QuestionnaireCategory.findAll();
  }

  async findById(id) {
    return await QuestionnaireCategory.findByPk(id);
  }

  async findByQuestionnaireId(questionnaireId) {
    return await QuestionnaireCategory.findAll({
      where: {
        questionnaire_id: questionnaireId,
      },
    });
  }
}

module.exports = QuestionnaireCategoryRepository;
