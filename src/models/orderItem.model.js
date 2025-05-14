import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Order from "./order.model.js";
import Product from "./product.model.js";
import User from "./user.model.js";
import ProductVariant from "./productVariant.model.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("placed", "shipped", "delivered", "cancelled"),
      defaultValue: "placed",
    },
  },
  {
    timestamps: true,
  }
);

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });

OrderItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

OrderItem.belongsTo(ProductVariant, { foreignKey: "variantId" });
ProductVariant.hasMany(OrderItem, { foreignKey: "variantId" });

OrderItem.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
User.hasMany(OrderItem, { foreignKey: "sellerId" });

export default OrderItem;
