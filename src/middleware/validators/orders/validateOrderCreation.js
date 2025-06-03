import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateOrderCreation = [
  body("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isInt({ gt: 0 })
    .withMessage("Address ID must be a valid positive integer"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Phone number must be valid"),

  body("paymentStatus")
    .notEmpty()
    .withMessage("Payment status is required")
    .isIn(["prepaid", "COD"])
    .withMessage("Payment status must be either prepaid or COD"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
