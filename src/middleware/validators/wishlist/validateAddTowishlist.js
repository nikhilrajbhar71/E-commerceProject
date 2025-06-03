import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateAddToWishlist = [
  body("productId")
    .exists()
    .withMessage("productVariantId is required")
    .isInt({ gt: 0 })
    .withMessage("productVariantId must be a valid positive integer"),

  handleValidationErrors,
];
