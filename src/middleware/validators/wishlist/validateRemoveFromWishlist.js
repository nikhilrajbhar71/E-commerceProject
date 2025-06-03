import { param, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateRemoveFromWishlist = [
  param("productId")
    .isInt({ gt: 0 })
    .withMessage("productId must be a valid positive integer"),

  handleValidationErrors,
];
