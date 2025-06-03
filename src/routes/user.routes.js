import express from "express";
import {
  changePassword,
  deleteUserProfile,
  forgotPassword,
  getUserProfile,
  refreshToken,
  resetPassword,
  userLogin,
  userLogout,
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
import { validateUserId } from "../middleware/validators/users/validateUserId.js";
import { validateChangePassword } from "../middleware/validators/users/validateUserPassword.js";

const router = express.Router();

router.post("/send-otp", validateUserRegister, userRegisterRequest);
router.post("/verify-otp", validateUserRegisterVerify, userRegisterVerify);
router.post("/login", validateUserLogin, userLogin);
router.delete("/logout", authenticateUser, userLogout);

router.get("/refresh", verifyRefreshToken, refreshToken);
router.get("/:id", validateUserId, getUserProfile);
router.delete("/", authenticateUser, deleteUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post(
  "/change-password",
  validateChangePassword,
  authenticateUser,
  changePassword
);
router.use("/address", addressRouter);

export default router;
