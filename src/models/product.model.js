import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./category.model.js";
import User from "./user.model.js";
const Product = sequelize.define(
  "Product",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    bannerImage: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

Product.belongsTo(Category, { foreignKey: "categoryId", onDelete: "SET NULL" });
Category.hasMany(Product, { foreignKey: "categoryId" });

Product.belongsTo(User, { foreignKey: "sellerId", onDelete: "SET NULL" });
User.hasMany(Product, { foreignKey: "sellerId" });

export default Product;
