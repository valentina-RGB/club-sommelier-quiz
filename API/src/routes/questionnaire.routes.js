const { Router } = require('express');
const QuestionnaireController = require('../controllers/questionnaire.controller');

const { validateQuestionnaire, validateUpdateQuestionnaire } = require('../middlewares/questionnaire.middleware');
const questionnaireController = new QuestionnaireController();
const router = Router();
const { authenticateJWT } = require('../middlewares/auth.middleware');

router
    .get('/',authenticateJWT, questionnaireController.getAllQuestionnaires)
    .get('/:id', questionnaireController.getQuestionnaireById)
    .post('/',authenticateJWT, validateQuestionnaire, questionnaireController.createQuestionnaire)
    .patch('/:id',authenticateJWT, validateUpdateQuestionnaire, questionnaireController.updateQuestionnaire)

module.exports = router;