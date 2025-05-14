import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateAddAddress = [
  body("label").trim().notEmpty().withMessage("Label is required"),

  body("line1").trim().notEmpty().withMessage("Address line 1 is required"),

  body("line2").optional().trim(),

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
