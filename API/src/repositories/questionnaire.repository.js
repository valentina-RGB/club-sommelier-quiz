const { Question, Level, Category } = require("../models");
const { Questionnaire } = require("../models/questionnaire.model");

class QuestionnairesRepository {
  async create(data) {
    return await Questionnaire.create(data);
  }

  async findById(id) {
    return await Questionnaire.findByPk(id, {
      include: [
        {
          model: Question,
          as: "questions",
          through: {
            attributes: ["position"],
          },
          include: [
            {
              model: Level,
              as: "level",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findAll() {
    return await Questionnaire.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async update(id, data, transaction) {
    await Questionnaire.update(data, { where: { id }, transaction });
    return this.findById(id);
  }

  // Agrega este método simple
  async findByPk(id) {
    return await Questionnaire.findByPk(id);
  }
}

module.exports = QuestionnairesRepository;
