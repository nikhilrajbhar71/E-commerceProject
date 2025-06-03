import express from "express";
import authenticateUser from "../middleware/authenticateUser.js";
import {
  createReview,
  deleteReview,
  getReviewsByProduct,
  updateReview,
} from "../controllers/review.controller.js";
import { validateCreateReview } from "../middleware/validators/review/validateCreateReview.js";
import { validateProductId } from "../middleware/validators/products/validateProductId.js";
import { validateReviewId } from "../middleware/validators/review/validateReviewId.js";

const router = express.Router();

router.post("/", validateCreateReview, authenticateUser, createReview);
router.get("/:productId", validateProductId, getReviewsByProduct);
router.put("/:id", validateReviewId, authenticateUser, updateReview);
router.delete("/:id", validateReviewId, authenticateUser, deleteReview);

export default router;
