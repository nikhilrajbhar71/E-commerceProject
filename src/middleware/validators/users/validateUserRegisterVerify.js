import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateUserRegisterVerify = [
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[0-9]{10}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("OTP must be exactly 6 digits"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
