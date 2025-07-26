import { check } from 'express-validator';

export const validateRegistration = [
  check('email').isEmail().withMessage('Enter a valid email'),
  check('password')
  .matches(/[A-Z]/).withMessage('Must include an uppercase letter')
  .matches(/[a-z]/).withMessage('Must include a lowercase letter')
  .matches(/[0-9]/).withMessage('Must include a number')
  .matches(/[\W]/).withMessage('Must include a special character')
.notEmpty().withMessage('Password is required')
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];

export const validateLogin = [
  check('email').isEmail().withMessage('Enter a valid email'),
  check('password').notEmpty().withMessage('Password is required')
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];
