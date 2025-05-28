import crypto from "crypto";
import bcrypt from "bcrypt";

import responseHandler from "../utils/responseHandler.js";
import { jwtSignHelper } from "../utils/jwtSignHelper.js";
import {
  checkIfUserExists,
  checkIfUserExistsByEmail,
  createAddress,
  createUser,
  deleteAddressById,
  deleteUser,
  fetchAddressCount,
  findAllAddresses,
  findIfUserExists,
  findResetToken,
  findUserByEmail,
  findUserByPhoneNumber,
  findUserByPk,
  generateResetToken,
  hashPassword,
  markAllUserAddressesAsNonDefault,
  setAddressAsDefault,
  setUserAsVerified,
  updateAddressById,
  updateUserData,
  updateUserPassword,
  verifyOTP,
} from "../services/user.service.js";

import { sendResetEmail } from "../utils/sendResetEmail.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import UserResource from "../resources/user.resource.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTP } from "../utils/sendSMS.js";

import AddressResource from "../resources/address.resource.js";
import { response } from "express";

export const userRegisterRequest = async (req, res, next) => {
  try {
    const { email, password, role, name, phoneNumber } = req.body;

    const existingUser = await findUserByPhoneNumber(phoneNumber);
    if (existingUser && existingUser?.isVerified == true) {
      return responseHandler(
        res,
        202,
        "Phone number already registered,Please sign up!",
        {}
      );
    }

    const { otp, otpExpiry } = generateOTP();

    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      // if user hasn't been verified but has sent otp once, we will update his details
      await updateUserData(
        name,
        email,
        hashedPassword,
        role,
        phoneNumber,
        otp,
        otpExpiry
      );
    } else {
      await createUser(
        name,
        email,
        hashedPassword,
        role,
        phoneNumber,
        otp,
        otpExpiry
      );
    }

    await sendOTP(phoneNumber, otp);

    return responseHandler(res, 200, "OTP sent successfully");
  } catch (error) {
    next(error);
  }
};

export const userRegisterVerify = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await checkIfUserExists(phoneNumber);

    verifyOTP(otp, user.otp, user.otpExpiry);

    //  this will set user.isVerified = true and remote the otp from user table

    await setUserAsVerified(user);

    return responseHandler(res, 200, "User registered successfully", {});
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user?.isVerified) {
      return responseHandler(res, 404, "User doesn't exist, please sign up.");
    }

    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return responseHandler(res, 401, "Incorrect username or password");
    }

    const accessToken = jwtSignHelper(user, "1h", process.env.JWT_SECRET);
    const refreshToken = jwtSignHelper(user, "7d", process.env.REFRESH_SECRET);

    return responseHandler(res, 200, "User logged in  successfully", {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const accesstoken = jwtSignHelper(req.user, "1h", process.env.JWT_SECRET);
    const refreshToken = jwtSignHelper(
      req.user,
      "7d",
      process.env.REFRESH_SECRET
    );

    return responseHandler(res, 200, "Token refreshed successfully", {
      accesstoken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await findIfUserExists(req.params.id);
    return responseHandler(
      res,
      200,
      "User profile fetched successfully",
      new UserResource(user).exec()
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    return responseHandler(res, 200, "User profile deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // only proceed if email exists in our db
    await checkIfUserExistsByEmail(email);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    await generateResetToken(email, token, expiresAt);

    await sendResetEmail(email, token);

    responseHandler(res, 200, "created reset token", {});
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const tokenEntry = await findResetToken(token);

    const user = await findUserByEmail(tokenEntry.email);

    user.password = await hashPassword(newPassword);
    await user.save();

    await PasswordResetToken.destroy({ where: { token } });

    return responseHandler(res, 200, "Password changed successfully", {});
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const { label, line, city, state, postalCode, country } = req.body;
    const userId = req.user.id;
    const address = {
      label,
      line,
      city,
      state,
      postalCode,
      country,
    };

    const [newAddress, addressCount] = await Promise.all([
      createAddress(address, userId),
      fetchAddressCount(userId),
    ]);
    if (addressCount == 0) {
      await setAddressAsDefault(newAddress.id);
    }
    return responseHandler(res, 200, "Address added successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllAddresses = async (req, res, next) => {
  try {
    const addresses = await findAllAddresses(req.user.id);
    return responseHandler(
      res,
      200,
      "Addresses fetched successfully",
      AddressResource.collection(addresses)
    );
  } catch (error) {
    next(error);
    d;
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    await deleteAddressById(addressId, req.user.id);
    return responseHandler(res, 200, "Address deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const incomingData = req.body;
    await updateAddressById(incomingData, addressId, req.user.id);
    return responseHandler(res, 200, "Address updated successfully", {});
  } catch (error) {
    next(error);
  }
};

export const setAddressToDefault = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newDefaultId = req.params.id;
    await markAllUserAddressesAsNonDefault(userId);
    await setAddressAsDefault(newDefaultId);
    return responseHandler(res, 200, "Address set as default successfully", {});
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await findIfUserExists(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return responseHandler(res, 202, "Old password is incorrect");

    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(user, hashedPassword);

    return responseHandler(res, 200, "Password changed successfully", {});
  } catch (error) {
    next(error);
  }
};
