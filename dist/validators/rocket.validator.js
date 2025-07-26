"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateRocket = exports.validateAddRocket = void 0;
const express_validator_1 = require("express-validator");
exports.validateAddRocket = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Rocket name is required"),
    (0, express_validator_1.body)("rocketModel").notEmpty().isIn(['Falcon9', 'Starship', 'AtlasV']).withMessage("Rocket model is required"),
    (0, express_validator_1.body)("fuelCapacity").isFloat({ min: 0 }).withMessage("Fuel capacity must be a non-negative number"),
    (0, express_validator_1.body)("active").toBoolean().isBoolean().withMessage("Active status must be a boolean (true/false)"),
];
exports.validateUpdateRocket = [
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Rocket name cannot be empty"),
    (0, express_validator_1.body)("rocketModel").optional().notEmpty().isIn(['Falcon9', 'Starship', 'AtlasV']).withMessage("Rocket model is not valid"),
    (0, express_validator_1.body)("fuelCapacity").optional().isFloat({ min: 0 }).withMessage("Fuel capacity must be a non-negative number"),
    (0, express_validator_1.body)("active").optional().toBoolean().isBoolean().withMessage("Active must be a boolean"),
];
