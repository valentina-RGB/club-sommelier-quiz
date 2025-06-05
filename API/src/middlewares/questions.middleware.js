const { body, validationResult } = require('express-validator');

const validateQuestion = [
  body('question')
    .trim()
    .notEmpty().withMessage('La pregunta es obligatoria'),

  body('response')
    .notEmpty().withMessage('La respuesta es obligatoria')
    .toBoolean()
    .isBoolean().withMessage('La respuesta debe ser un valor booleano (true o false)'),

  body('level_id')
    .notEmpty().withMessage('El nivel es obligatorio')
    .isInt().withMessage('El nivel debe ser un número entero'),

  body('categories')
    .isArray({ min: 1 }).withMessage('You must provide at least one category')
    .custom((arr) => arr.every(Number.isInteger)).withMessage('Categories must be integers'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateQuestion
};
