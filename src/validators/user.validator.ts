import { body } from "express-validator";

export const validateUpdateProfile = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
];

export const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];
