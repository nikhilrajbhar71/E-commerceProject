import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderDetails,
} from "../controllers/order.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateOrderCreation } from "../middleware/validators/orders/validateOrderCreation.js";
import { validateOrderId } from "../middleware/validators/orders/validatorOrderId.js";

const router = express.Router();
// validateOrderCreation,
router.post("/", authenticateUser, createOrder);

router.get("/:id", validateOrderId, authenticateUser, getOrderById);
router.get("/", authenticateUser, getAllOrders);
router.delete("/:id", validateOrderId, authenticateUser, deleteOrder);
router.put(
  "/details/:id",
  validateOrderId,
  authenticateUser,
  updateOrderDetails
);

export default router;
