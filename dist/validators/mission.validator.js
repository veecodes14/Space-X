"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetPendingMissions = exports.validateMissionId = exports.validateScheduleMission = void 0;
const express_validator_1 = require("express-validator");
exports.validateScheduleMission = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("rocket").notEmpty().withMessage("Rocket is required"),
    (0, express_validator_1.body)("launchDate")
        .isISO8601().withMessage("Launch date must be a valid date")
        .custom((value) => {
        if (new Date(value) < new Date()) {
            throw new Error("Launch date cannot be in the past");
        }
        return true;
    }),
    (0, express_validator_1.body)("launchLocation").notEmpty().withMessage("Launch location is required"),
    (0, express_validator_1.body)("destination").notEmpty().withMessage("Destination is required"),
];
exports.validateMissionId = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid mission ID"),
];
exports.validateGetPendingMissions = [
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["scheduled", "completed", "aborted"])
        .withMessage("Invalid status filter"),
];
