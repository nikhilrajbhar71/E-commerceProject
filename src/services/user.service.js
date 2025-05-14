import User from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import redisClient from "../utils/redisClient.js";
import Address from "../models/address.model.js";
import { allowedAddressFields } from "../config/constants.js";

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  return user;
};
export const createUser = async (name, email, password, role, phoneNumber) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
    phoneNumber,
  });
  delete user.dataValues.password;
  return user;
};

export const findUserByPk = async (id) => {
  const user = await User.findByPk(id);

  return user;
};
export const findIfUserExists = async (id) => {
  const user = await findUserByPk(id);
  if (!user) {
    throw new AppError(404, "User does not exist");
  }
  return user;
};

export const deleteUser = async (id) => {
  await User.destroy({
    where: {
      id,
    },
  });
};

export const generateResetToken = async (email, token, expiresAt) => {
  const newToken = await PasswordResetToken.create({ email, token, expiresAt });

  return newToken;
};

export const findResetToken = async (token) => {
  const tokenEntry = await PasswordResetToken.findOne({
    where: {
      token,
      expiresAt: { [Op.gt]: new Date() },
    },
  });
  if (!tokenEntry) {
    throw new AppError(401, "Invalid or expired token");
  }
  return tokenEntry;
};

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const createAddress = async (address, userId) => {
  await Address.create({ ...address, userId });
};

export const findAllAddresses = async (userId) => {
  const addresses = await Address.findAll({
    where: {
      userId,
    },
  });
  return addresses;
};

export const deleteAddressById = async (addressId) => {
  await Address.destroy({
    where: {
      id: addressId,
    },
  });
};

export const updateAddressById = async (incomingData, addressId) => {
  const address = await Address.findOne({ where: { id: addressId } });
  for (const key of allowedAddressFields) {
    if (incomingData[key] !== undefined) {
      address[key] = incomingData[key];
    }
  }
  await address.save();
};

export const matchOTP = (otp, storedOtp) => {
  if (otp !== storedOtp) {
    throw new AppError(200, "OTP did not match");
  }
};
