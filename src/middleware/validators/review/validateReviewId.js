import { param, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateReviewId = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Review ID must be a valid positive integer"),

  handleValidationErrors,
];
