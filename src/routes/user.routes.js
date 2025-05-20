import express from "express";
import {
  deleteUserProfile,
  forgotPassword,
  getUserProfile,
  refreshToken,
  resetPassword,
  userLogin,
  userRegisterRequest,
  userRegisterVerify,
} from "../controllers/user.controller.js";
import { validateUserRegister } from "../middleware/validators/users/registerValidator.js";
import { validateUserLogin } from "../middleware/validators/users/loginValidator.js";
import verifyRefreshToken from "../middleware/verifyRefreshToken.js";

import authenticateUser from "../middleware/authenticateUser.js";
import { validateGetProduct } from "../middleware/validators/products/getProductValidator.js";
import addressRouter from "./address.routes.js";
import { validateUserRegisterVerify } from "../middleware/validators/users/validateUserRegisterVerify.js";

const router = express.Router();

router.post("/send-otp", validateUserRegister, userRegisterRequest);
router.post("/verify-otp", validateUserRegisterVerify, userRegisterVerify);
router.post("/login", validateUserLogin, userLogin);
router.get("/refresh", verifyRefreshToken, refreshToken);
router.get("/:id", validateGetProduct, getUserProfile);
router.delete("/", authenticateUser, deleteUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.use("/address", addressRouter);

export default router;
