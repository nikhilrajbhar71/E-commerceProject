import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";



export const getPaginatedCategories = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;
  return await Category.findAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

