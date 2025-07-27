import { body } from "express-validator";

export const validateAddRocket = [
  body("name").notEmpty().withMessage("Rocket name is required"),
  body("rocketModel").notEmpty().isIn(['Falcon9', 'Starship', 'AtlasV']).withMessage("Rocket model is required"),
  body("fuelCapacity").isFloat({ min: 1 }).withMessage("Fuel capacity must be more than 1"),
  body("active").toBoolean().isBoolean().withMessage("Active status must be a boolean (true/false)"),
];

export const validateUpdateRocket = [
  body("name").optional().notEmpty().withMessage("Rocket name cannot be empty"),
  body("rocketModel").optional().notEmpty().isIn(['Falcon9', 'Starship', 'AtlasV']).withMessage("Rocket model is not valid"),
  body("fuelCapacity").optional().isFloat({ min: 1 }).withMessage("Fuel capacity must be more than 1"),
  body("active").optional().toBoolean().isBoolean().withMessage("Active must be a boolean"),
];
