const {body, validationResult} = require('express-validator');

const validateAdmin = [
  body('name')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({min: 3}).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),

  body('email')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  }
];

module.exports = {
  validateAdmin
};