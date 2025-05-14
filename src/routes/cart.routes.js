import express from "express";
import {
  addItems,
  deleteItem,
  getCart,
  updateItemsCount,
} from "../controllers/cart.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/", authenticateUser, addItems);
router.get("/", authenticateUser, getCart);
router.put("/", authenticateUser, updateItemsCount);
router.delete("/:id", authenticateUser, deleteItem);


export default router;
