import CategoryResource from "../resources/category.resource.js";
import { getPaginatedCategories } from "../services/category.service.js";
import responseHandler from "../utils/responseHandler.js";

export const getAllCategories = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    const categories = await getPaginatedCategories(page, limit);

    return responseHandler(
      res,
      200,
      "All categories fetched successfully",
      CategoryResource.collection(categories)
    );
  } catch (error) {
    next(error);
  }
};
