import { param, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateProductId = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Product ID must be a positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
