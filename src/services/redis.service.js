import redisClient from "../utils/redisClient.js";

export const cacheDataInRedis = async (key, data, expiryTime) => {
  await redisClient.set(key, JSON.stringify(data), "EX", expiryTime);
};

export const fetchHomePageDataFromRedis = async (key) => {
  return await redisClient.get(key);
};
