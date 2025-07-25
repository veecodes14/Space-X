import { body } from "express-validator";

export const validateAddRocket = [
  body("name").notEmpty().withMessage("Rocket name is required"),
  body("rocketModel").notEmpty().withMessage("Rocket model is required"),
  body("fuelCapacity")
    .isNumeric()
    .withMessage("Fuel capacity must be a number"),
  body("active")
    .isBoolean()
    .withMessage("Active status must be a boolean (true/false)"),
];

export const validateUpdateRocket = [
  body("name").optional().notEmpty().withMessage("Rocket name cannot be empty"),
  body("rocketModel").optional().notEmpty().withMessage("Rocket model cannot be empty"),
  body("fuelCapacity")
    .optional()
    .isNumeric()
    .withMessage("Fuel capacity must be a number"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean"),
];
