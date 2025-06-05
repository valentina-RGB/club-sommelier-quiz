const { body, validationResult } = require('express-validator');

const validateQuestionnaire = [
    body('title')
        .exists({ checkFalsy: true }).withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

    body('description')
        .optional({ checkFalsy: true })
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
        
    body('categories')
        .isArray({ min: 1 }).withMessage('You must provide at least one category')
        .custom((arr) => arr.every(Number.isInteger)).withMessage('Categories must be integers'),

    body('questions')
        .exists({ checkFalsy: true }).withMessage('Questions is required')
        .isArray().withMessage('Questions must be an array')
        .custom((questions) => {
            return questions.every(id =>
                Number.isInteger(id) &&
                id > 0
            );
        }).withMessage('Questions must be an array of positive integers'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

const validateUpdateQuestionnaire = [
    body('title')
        .optional({ checkFalsy: true })
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

    body('description')
        .optional({ checkFalsy: true })
        .isString().withMessage('Description must be a string')
        .isLength({ min: 3 }).withMessage('Description must be at least 3 characters long'),

    body('categories')
        .optional()
        .isArray({ min: 1 }).withMessage('You must provide at least one category')
        .custom((arr) => arr.every(Number.isInteger)).withMessage('Categories must be integers'),

    body('questions')
        .optional()
        .isArray().withMessage('Questions must be an array')
        .custom((questions) => {
            return questions.every(id =>
                Number.isInteger(id) &&
                id > 0
            );
        }).withMessage('Questions must be an array of positive integers'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = { validateQuestionnaire, validateUpdateQuestionnaire };
