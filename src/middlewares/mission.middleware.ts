import { body } from "express-validator";

export const validateScheduleMission = [
  body("name").notEmpty().withMessage("Name is required"),
  body("rocket").notEmpty().withMessage("Rocket is required"),
  body("launchDate").isISO8601().withMessage("Launch date must be a valid date"),
  body("launchLocation").notEmpty().withMessage("Launch location is required"),
  body("destination").notEmpty().withMessage("Destination is required"),
];