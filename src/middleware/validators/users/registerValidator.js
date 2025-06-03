import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateUserRegister = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("name").trim().notEmpty().withMessage("Name is required"),

  body("role")
    .isIn(["seller", "customer"])
    .withMessage("Role must be either 'seller' or 'customer'"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[0-9]{10}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
