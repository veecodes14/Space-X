"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChangePassword = exports.validateUpdateProfile = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateProfile = [
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Name cannot be empty"),
];
exports.validateChangePassword = [
    (0, express_validator_1.body)("oldPassword").notEmpty().withMessage("Old password is required"),
    (0, express_validator_1.body)("newPassword").notEmpty().withMessage("New password is required").custom((value, { req }) => {
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
