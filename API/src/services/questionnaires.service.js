const { sequelize } = require("../config/connection");

const CategoryRepository = require("../repositories/category.repository");
const QuestionnaireRepository = require("../repositories/questionnaire.repository");
const QuestionnaireQuestionRepository = require("../repositories/questionnaire-question.repository");
const QuestionnaireCategoryRepository = require("../repositories/questionnaire-category.repository");
const QuestionRepository = require("../repositories/question.repository");

class QuestionnairesService {
  constructor() {
    this.questionnaireRepository = new QuestionnaireRepository();
    this.categoryRepository = new CategoryRepository();
    this.questionnaireCategoryRepository =
      new QuestionnaireCategoryRepository();
    this.questionnaireQuestionRepository =
      new QuestionnaireQuestionRepository();
    this.questionRepository = new QuestionRepository();
  }

  async createQuestionnaire(data) {
    const t = await sequelize.transaction();

    try {
      const questionnaire = await this.questionnaireRepository.create(
        {
          title: data.title,
          description: data.description || "",
        },
        t
      );

      for (const categoryId of data.categories) {
        const category = await this.categoryRepository.getById(categoryId);
        if (!category) {
          console.warn(
            `Category with ID ${categoryId} does not exist. Skipping...`
          );
          continue;
        }

        await this.questionnaireCategoryRepository.create({
          questionnaire_id: questionnaire.id,
          category_id: categoryId,
        });
      }

      const questionnaireQuestions = data.questions.map(
        (questionId, index) => ({
          questionnaire_id: questionnaire.id,
          question_id: questionId,
          position: index + 1,
        })
      );

      await this.questionnaireQuestionRepository.createMany(
        questionnaireQuestions,
        t
      );

      await t.commit();
      return questionnaire;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async findById(id) {
    return await this.questionnaireRepository.findById(id);
  }

  async findAll() {
    return await this.questionnaireRepository.findAll();
  }

  async update(id, data) {
    const t = await sequelize.transaction();

    try {
      const existingQuestionnaire = await this.questionnaireRepository.findByPk(
        id
      );
      if (!existingQuestionnaire) {
        const error = new Error(`Questionnaire with ID ${id} does not exist.`);
        error.status = 404;
        throw error;
      }

      // VALIDAR Y ACTUALIZAR CATEGORIES
      if (
        data.categories &&
        Array.isArray(data.categories) &&
        data.categories.length > 0
      ) {
        for (const categoryId of data.categories) {
          const category = await this.categoryRepository.getById(categoryId);
          if (!category) {
            const error = new Error(
              `Category with ID ${categoryId} does not exist.`
            );
            error.status = 404;
            throw error;
          }
        }
        const existingCategoryAssociations =
          await this.questionnaireCategoryRepository.findByQuestionnaireId(id);
        const existingCategoryIds = existingCategoryAssociations.map(
          (assoc) => assoc.category_id
        );
        for (const categoryId of data.categories) {
          if (!existingCategoryIds.includes(categoryId)) {
            await this.questionnaireCategoryRepository.create({
              questionnaire_id: id,
              category_id: categoryId,
            });
          }
        }
      }

      // VALIDAR Y ACTUALIZAR QUESTIONS
      if (
        data.questions &&
        Array.isArray(data.questions) &&
        data.questions.length > 0
      ) {
        for (const questionId of data.questions) {
          const question = await this.questionRepository.findById(questionId);
          if (!question) {
            const error = new Error(
              `Question with ID ${questionId} does not exist.`
            );
            error.status = 404;
            throw error;
          }
        }
        const existingQuestionAssociations =
          await this.questionnaireQuestionRepository.findByQuestionnaireId(id);
        const existingQuestionIds = existingQuestionAssociations.map(
          (assoc) => assoc.question_id
        );

        const newAssociations = [];
        for (const [index, questionId] of data.questions.entries()) {
          if (!existingQuestionIds.includes(questionId)) {
            newAssociations.push({
              questionnaire_id: id,
              question_id: questionId,
              position: index + 1,
            });
          }
        }
        if (newAssociations.length > 0) {
          await this.questionnaireQuestionRepository.createMany(
            newAssociations,
            t
          );
        }
      }
      // ACTUALIZAR EL QUESTIONNAIRE
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;

      if (Object.keys(updateData).length > 0) {
        await this.questionnaireRepository.update(id, updateData, t);
      }

      await t.commit();
      const updatedQuestionnaire = await this.questionnaireRepository.findById(
        id
      );
      return updatedQuestionnaire;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = QuestionnairesService;
