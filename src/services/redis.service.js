import AppError from "../utils/AppError.js";
import redisClient from "../utils/redisClient.js";

export const cacheUserOTPInRedis = async (phoneNumber, userData) => {
  await redisClient.setEx(`register:otp:${phoneNumber}`, 300, userData);
};

export const fetchUserDataFromRedis = async (phoneNumber) => {
  const redisData = await redisClient.get(`register:otp:${phoneNumber}`);

  if (!redisData) {
    throw new AppError(401, "OTP not found");
  }
  return await JSON.parse(redisData);
};

export const deleteOTPFromRedis = async (phoneNumber) => {
  await redisClient.del(`register:otp:${phoneNumber}`);
};
