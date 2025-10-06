import { body, validationResult } from "express-validator";



function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const registerValidationRules = [

    body('username')
        .isString().withMessage('Username must be a string')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long'),
    body('email')
        .isEmail().withMessage('Please provide a valid email address'),
    body('fullName.firstName')
        .isString().withMessage('First name must be a string')
        .isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters long'),
    body('fullName.lastName')
        .isString().withMessage('Last name must be a string')
        .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters long'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')

    , validate
]

export const resetPasswordValidationRules = [
    body('email')
        .isEmail().withMessage('Please provide a valid email address'),
    body('otp')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 characters long'),
    body('newPassword')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    , validate
]