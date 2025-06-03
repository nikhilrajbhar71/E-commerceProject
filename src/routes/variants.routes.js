import express from "express";
import {
  createVariant,
  deleteVariant,
  getVariantsByProduct,
  updateVariant,
} from "../controllers/productVariant.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateProductId } from "../middleware/validators/products/validateProductId.js";
import verifySeller from "../middleware/verifySeller.js";
const router = express.Router();

router.post(
  "/:id",
  validateProductId,
  authenticateUser,
  verifySeller,
  createVariant
);
router.put("/:id", authenticateUser, verifySeller, updateVariant);
router.delete(
  "/:id",
  validateProductId,
  authenticateUser,
  verifySeller,
  deleteVariant
);
router.get("/:id", validateProductId, getVariantsByProduct);

export default router;
