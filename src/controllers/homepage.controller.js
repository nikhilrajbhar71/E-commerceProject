import {
  cacheDataInRedis,
  fetchHomePageDataFromRedis,
} from "../services/redis.service.js";

import { fetchProductForHomePage } from "../services/product.service.js";
import responseHandler from "../utils/responseHandler.js";
import { getPaginatedCategories } from "../services/category.service.js";

export const getHomePage = async (req, res, next) => {
  try {
    const cacheKeyForHomePage = "homepage:data";
    const cached = await fetchHomePageDataFromRedis(cacheKeyForHomePage);

    if (cached) {
      const cachedData = JSON.parse(cached);
      return responseHandler(res, 200, "Home page data ", cachedData);
    }

    const homepageData = {
      products: await fetchProductForHomePage(30),
      categories: await getPaginatedCategories(1, 30),
    };

    await cacheDataInRedis(cacheKeyForHomePage, homepageData, 600);
    return responseHandler(res, 200, "Home page data", homepageData);
  } catch (error) {
    next(error);
  }
};
