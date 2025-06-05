const express = require('express');
const QuestionnaireQuestionController = require('../controllers/questionnaire-question.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const router = express.Router();
const questionnaireQuestionController = new QuestionnaireQuestionController();

router
  .delete('/',authenticateJWT, questionnaireQuestionController.deleteQuestionnaireQuestion);


module.exports = router;