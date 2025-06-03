import Review from "../models/review.model.js";
import User from "../models/user.model.js";
export const createReviewService = async (
  productId,
  rating,
  comment,
  userId
) => {
  await Review.create({ productId, rating, comment, userId });
};

export const fetchAllReviews = async (productId) => {
  return await Review.findAll({
    where: { productId },
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
    ],
  });
};

export const findReview = async (id, userId) => {
  const review = await Review.findOne({ where: { id, userId } });

  if (!review) throw new AppError(404, "Review not found");
  return review;
};

export const deleteReviewService = async (review) => {
  await review.destroy();
};

export const updateReviewService = async (review, rating, comment) => {
  if (rating) {
    review.rating = rating;
  }
  if (comment) {
    review.comment = comment;
  }
  await review.save();
  console.log("after update the rating is " + JSON.stringify(review.rating));
};
