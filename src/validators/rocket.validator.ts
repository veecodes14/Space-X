import { body } from "express-validator";

export const validateAddRocket = [
  body("name").notEmpty().withMessage("Rocket name is required"),
  body("rocketModel").notEmpty().isIn(['Falcon9', 'Starship', 'AtlasV']).withMessage("Rocket model is required"),
  body("fuelCapacity").isFloat({ min: 0 }).withMessage("Fuel capacity must be a non-negative number"),
  body("active").toBoolean().isBoolean().withMessage("Active status must be a boolean (true/false)"),
];

export const validateUpdateRocket = [
  body("name").optional().notEmpty().withMessage("Rocket name cannot be empty"),
  body("rocketModel").optional().notEmpty().isIn(['Falcon9', 'Starship', 'AtlasV']).withMessage("Rocket model is not valid"),
  body("fuelCapacity").optional().isFloat({ min: 0 }).withMessage("Fuel capacity must be a non-negative number"),
  body("active").optional().toBoolean().isBoolean().withMessage("Active must be a boolean"),
];
