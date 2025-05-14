import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateAddItems = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  body("products.*.productId")
    .isInt({ gt: 0 })
    .withMessage("Each product must have a valid productId"),

  body("products.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Each product must have a quantity greater than 0"),

  body("products.*.variantId")
    .isInt({ gt: 0 })
    .withMessage("Each product must have a valid variantId"),

  handleValidationErrors,
];
