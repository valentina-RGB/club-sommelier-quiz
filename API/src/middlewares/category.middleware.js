const { body, validationResult } = require('express-validator');

const validateCategory = [
  body('name')
    .notEmpty().withMessage('El nombre de la categoría es obligatorio')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).withMessage('El nombre solo puede contener letras y espacios'),

  body('description')
    .optional({ checkFalsy: true })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).withMessage('La descripción solo puede contener letras y espacios'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateCategory
};
