const {body, validationResult} = require('express-validator');

const validatParticipant = [
    body('fullName')
        .notEmpty().withMessage('fullName is required')
        .isLength({min: 3}).withMessage('fullName must be at least 3 characters long'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('numberPhone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports = {
    validatParticipant
};