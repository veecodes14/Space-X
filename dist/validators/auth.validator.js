"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegistration = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Enter a valid email'),
    (0, express_validator_1.check)('password')
        .matches(/[A-Z]/).withMessage('Must include an uppercase letter')
        .matches(/[a-z]/).withMessage('Must include a lowercase letter')
        .matches(/[0-9]/).withMessage('Must include a number')
        .matches(/[\W]/).withMessage('Must include a special character')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];
exports.validateLogin = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Enter a valid email'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];
