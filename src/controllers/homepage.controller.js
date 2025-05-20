import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import redisClient from "../utils/redisClient.js";
import responseHandler from "../utils/responseHandler.js";

export const getHomePage = async (req, res, next) => {
  //will refactor on next working day
  try {
    const cacheKey = "homepage:data";

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      return responseHandler(res, 200, "Home page data ", cachedData);
    }

    const products = await Product.findAll({ limit: 20 });
    const categories = await Category.findAll({});

    const homepageData = {
      products,
      categories,
    };

    await redisClient.set(cacheKey, JSON.stringify(homepageData), "EX", 600);

    return responseHandler(res, 200, "Home page data", homepageData);
  } catch (error) {
    next(error);
  }
};
