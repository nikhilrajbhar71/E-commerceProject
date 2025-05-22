import RecentlyViewed from "../models/recentlyViewed.model.js";
import redisClient from "./redisClient.js";


export const trackRecentlyViewed = async (userId, productId) => {
  const redisKey = `recently_viewed:${userId}`;

  await redisClient.lRem(redisKey, 0, productId);
  await redisClient.lPush(redisKey, productId);
  await redisClient.lTrim(redisKey, 0, 19);

  await RecentlyViewed.upsert({
    userId,
    productId,
    viewedAt: new Date(),
  });
};
