const express = require('express');
const CategoryController = require('../controllers/category.controller');
const { validateCategory } = require('../middlewares/category.middleware');

const router = express.Router();
const categoryController = new CategoryController();
const {authenticateJWT} = require('../middlewares/auth.middleware')


router
    .get('/',authenticateJWT, categoryController.getAllCategorys)
    .get('/:id',authenticateJWT, categoryController.getCategoryById)
    .post('/',authenticateJWT, validateCategory, categoryController.createCategory)
    .put('/:id',authenticateJWT, categoryController.updateCategory)
    .delete('/:id',authenticateJWT, categoryController.deleteCategory)

module.exports = router;
