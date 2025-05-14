import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return throwValidationError(res, errors);
  }
  next();
};

export const validateOrderCreation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ gt: 0 })
    .withMessage("Product ID must be a positive integer"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be 10 digits"),

  body("paymentStatus")
    .optional()
    .isIn([ "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"])
    .withMessage("Payment status must be one of: pending, paid, failed"),

  handleValidationErrors,
];
