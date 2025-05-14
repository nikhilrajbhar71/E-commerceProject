import { param, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateOrderId = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isInt({ gt: 0 })
    .withMessage("Order ID must be a valid positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
