import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateCreateReview = [
  body("productId")
    .isInt({ gt: 0 })
    .withMessage("Product ID must be a valid positive integer"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string"),

  handleValidationErrors,
];
