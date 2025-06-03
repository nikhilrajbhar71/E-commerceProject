import RecentlyViewed from "../models/recentlyViewed.model.js";
import redisClient from "./redisClient.js";

export const trackRecentlyViewed = async (userId, productId) => {
  const redisKey = `recently_viewed:${userId}`;

  await redisClient
    .multi()
    .lRem(redisKey, 0, productId)
    .lPush(redisKey, productId)
    .lTrim(redisKey, 0, 19)
    .exec();

  await RecentlyViewed.upsert({
    userId,
    productId,
    viewedAt: new Date(),
  });
};
