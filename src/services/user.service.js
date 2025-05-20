import User from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import Address from "../models/address.model.js";
import { allowedAddressFields } from "../config/constants.js";

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  return user;
};

export const checkIfUserExists = async (phoneNumber) => {
  const user = await User.findOne({ where: { phoneNumber } });

  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

export const checkIfUserExistsByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new AppError(404, "User not found");
  }
};
export const findUserByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({ where: { phoneNumber } });
};
export const createUser = async (
  name,
  email,
  password,
  role,
  phoneNumber,
  otp,
  otpExpiry
) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
    phoneNumber,
    otp,
    otpExpiry,
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
  return await bcrypt.hash(password, saltRounds);
};

export const createAddress = async (address, userId) => {
  return await Address.create({ ...address, userId });
};

export const findAllAddresses = async (userId) => {
  return await Address.findAll({
    where: {
      userId,
    },
  });
};

export const deleteAddressById = async (addressId, userId) => {
  await Address.destroy({
    where: {
      id: addressId,
      userId,
    },
  });
};

export const updateAddressById = async (incomingData, addressId, userId) => {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) {
    throw new AppError(404, "Address doesn't exit");
  }
  for (const key of allowedAddressFields) {
    if (incomingData[key] !== undefined) {
      address[key] = incomingData[key];
    }
  }
  await address.save();
};

export const verifyOTP = (inputOtp, storedOtp, expiryTime) => {
  if (inputOtp !== storedOtp) {
    throw new AppError(202, "Entered OTP is incorrect");
  }

  const now = new Date();
  if (now > new Date(expiryTime)) {
    throw new AppError(202, "OTP has expired");
  }
};

export const fetchAddressById = async (id) => {
  const address = await Address.findByPk(id);
  if (!address) {
    throw new AppError(404, "Address not found");
  }
};

export const fetchAddressCount = async (userId) => {
  const count = await Address.count({
    where: {
      userId,
    },
  });
  return count;
};

export const setAddressAsDefault = async (id) => {
  await Address.update({ isDefault: true }, { where: { id } });
};

export const markAllUserAddressesAsNonDefault = async (userId) => {
  await Address.update({ isDefault: false }, { where: { userId } });
};

export const verifyAddressOwnership = async (addressId, userId) => {
  const address = await Address.findByPk(addressId);
  if (address.userId != userId) {
    throw new AppError(401, "Unauthorized");
  }
};
export const updateUserData = async (
  name,
  email,
  hashedPassword,
  role,
  phoneNumber,
  otp,
  otpExpiry
) => {
  await User.update(
    {
      name,
      email,
      hashedPassword,
      role,
      otp,
      otpExpiry,
    },
    {
      where: {
        phoneNumber,
      },
    }
  );
};

export const setUserAsVerified = async (user) => {
  user.otp = "";
  user.isVerified = true;
  await user.save();
};
