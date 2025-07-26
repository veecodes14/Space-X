import { body } from "express-validator";

export const validateUpdateProfile = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
];

export const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword").notEmpty().withMessage("New password is required").custom((value, { req }) => {
    if (value === req.body.oldPassword) {
      throw new Error("New password must be different from old password");
    }
    return true;
  }).isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("New password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("New password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("New password must contain at least one special character"),
];
