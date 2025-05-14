import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

Order.belongsTo(User, { foreignKey: "userId", as: "customer" });
User.hasMany(Order, { foreignKey: "userId" });

export default Order;
