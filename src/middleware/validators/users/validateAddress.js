import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateAddAddress = [
  body("label").trim().notEmpty().withMessage("Label is required"),

  body("line").trim().notEmpty().withMessage("Address line  is required"),

  body("city").trim().notEmpty().withMessage("City is required"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("any")
    .withMessage("Invalid postal code"),

  body("country").trim().notEmpty().withMessage("Country is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
