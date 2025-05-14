import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import Product from "./product.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Address from "./address.model.js";
import ProductVariant from "./productVariant.model.js";
import Cart from "./cart.model.js";
import CartItem from "./cartItem.model.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log(" Database synced successfully.");
  } catch (error) {
    console.error(" Error syncing database:", error);
  }
};

export {
  User,
  Category,
  OrderItem,
  Order,
  Cart,
  CartItem,
  ProductVariant,
  Product,
  Address,
  PasswordResetToken,
  syncDatabase,
};
