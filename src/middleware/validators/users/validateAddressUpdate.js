import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateOptionalAddressFields = [
  body("label")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Label must not be empty"),

  body("line")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address line  must not be empty"),


  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City must not be empty"),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State must not be empty"),

  body("postalCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Postal code must not be empty")
    .isPostalCode("any")
    .withMessage("Invalid postal code"),

  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country must not be empty"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
