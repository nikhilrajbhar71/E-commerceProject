import { json } from "sequelize";
import Product from "../models/product.model.js";
import { fetchAllReviews } from "../services/review.service.js";

export const updateProductRating = async (productId) => {
  const reviews = await fetchAllReviews(productId);
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
 

  await Product.update(
    { rating: avgRating.toFixed(1), reviewCount: reviews.length },
    { where: { id: productId } }
  );
};
