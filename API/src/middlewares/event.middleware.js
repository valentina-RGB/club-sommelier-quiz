const { body, validationResult } = require('express-validator');

const validateEvent = [
    body('name')
        .notEmpty().withMessage('el nombre del producto es obligatoria')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

    body('questionnaire_id')
        .notEmpty().withMessage('El cuestionario es obligatorio')
        .matches('^[0-9]+$').withMessage('Solo es válido ingresar números'),

    body('start_time')
        .notEmpty().withMessage('La fecha de inicio es obligatoria')
        .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida en formato ISO 8601'),

    body('end_time')
        .notEmpty().withMessage('La fecha de fin es obligatoria')
        .isISO8601().withMessage('La fecha de fin debe ser una fecha válida en formato ISO 8601')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.start_time)) {
                throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateEvent
};
