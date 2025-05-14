import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("seller", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
  },
  {
    timestamps: true,
    updatedAt: true,
  }
);

export default User;
