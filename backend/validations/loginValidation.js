const { body, validationResult } = require('express-validator');

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateLogin };