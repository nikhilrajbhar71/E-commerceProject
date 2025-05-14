import express from "express";
import {
  addItems,
  deleteItem,
  getCart,
  updateItemsCount,
} from "../controllers/cart.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateAddItems } from "../middleware/validators/cart/validateAddItems.js";

const router = express.Router();

router.post("/", validateAddItems, authenticateUser, addItems);
router.get("/", authenticateUser, getCart);
router.put("/", authenticateUser, updateItemsCount);
router.delete("/:id", authenticateUser, deleteItem);

export default router;
