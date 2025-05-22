import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  updateStatus,
} from "../controllers/product.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";

import { validateGetProduct } from "../middleware/validators/products/getProductValidator.js";

import verifySeller from "../middleware/verifySeller.js";
import { validateProductCreation } from "../middleware/validators/products/productValidator.js";

import { validateProductId } from "../middleware/validators/products/validateProductId.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  verifySeller,
  upload.single("bannerImage"),
  validateProductCreation,
  createProduct
);
router.put(
  "/:id/status",
  validateProductId,
  authenticateUser,
  verifySeller,
  updateStatus
);
router.delete(
  "/:id",
  validateProductId,
  authenticateUser,
  verifySeller,
  validateGetProduct,
  deleteProduct
);
// using optionalAuth, if user hasn't provided token , then we can't fetch recently viewed product + the need to do this, if we tried to fetch recent product without optional auth, we needed userId, that had to be sent in query params
router.get("/", optionalAuth, getAllProducts);
// if the user sents token, then we keep that product in recently Viewed product
router.get("/:id", validateProductId, optionalAuth, getProduct);
router.put(
  "/:id",
  validateProductId,
  authenticateUser,
  verifySeller,
  updateProduct
);

export default router;
