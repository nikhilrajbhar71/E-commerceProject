import express from "express";
import authenticateUser from "../middleware/authenticateUser.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { validateAddToWishlist } from "../middleware/validators/wishlist/validateAddTowishlist.js";
import { validateRemoveFromWishlist } from "../middleware/validators/wishlist/validateRemoveFromWishlist.js";

const router = express.Router();

router.post("/", validateAddToWishlist, authenticateUser, addToWishlist);
router.get("/", authenticateUser, getWishlist);
router.delete(
  "/:productId",
  validateRemoveFromWishlist,
  authenticateUser,
  removeFromWishlist
);

export default router;
