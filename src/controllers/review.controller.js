import ReviewResource from "../resources/review.resource.js";
import {
  createReviewService,
  deleteReviewService,
  fetchAllReviews,
  findReview,
  updateReviewService,
} from "../services/review.service.js";
import responseHandler from "../utils/responseHandler.js";
import { updateProductRating } from "../utils/updateProductRating.js";

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    //  doubt : we don't the sequence of the completion
    await Promise.all([
      createReviewService(productId, rating, comment, userId),
      updateProductRating(productId),
    ]);

    return responseHandler(res, 200, "Review created successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await fetchAllReviews(productId);

    return responseHandler(
      res,
      200,
      "Reviews fetched successfully",
      ReviewResource.collection(reviews)
    );
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await findReview(id, userId);
    await Promise.all([
      updateReviewService(review, rating, comment),
      updateProductRating(review.productId),
    ]);

    return responseHandler(res, 200, "Reviews updated", {});
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await findReview(id, userId);

    const productId = review.productId;
    await deleteReviewService(review);

    await updateProductRating(productId);

    return responseHandler(res, 200, "Review deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
