const express = require('express');
const LevelController = require('../controllers/level.controller');

const router = express.Router();
const levelController = new LevelController();
const {authenticateJWT} = require('../middlewares/auth.middleware')


router
    .get('/',authenticateJWT, levelController.getLevels)
    .get('/:id',authenticateJWT, levelController.getLevelById)
    .post('/',authenticateJWT, levelController.createLevel)

module.exports = router;
