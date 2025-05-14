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
router.get("/", getAllProducts);
router.get("/:id", validateProductId, validateGetProduct, getProduct);
router.put(
  "/:id",
  validateProductId,
  authenticateUser,
  verifySeller,
  updateProduct
);

export default router;
