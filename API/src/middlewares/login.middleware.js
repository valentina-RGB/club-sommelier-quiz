const {body, validationResult} = require('express-validator');
const validateLogin = [
    body('email')
        .isEmail().withMessage('you must provide a valid email address'),
    body('password')
        .notEmpty().withMessage('The password is required')
        .isLength({min: 6}).withMessage('The password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports = {
    validateLogin
};