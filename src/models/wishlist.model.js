import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";
import Product from "./product.model.js";

const Wishlist = sequelize.define(
  "Wishlist",
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
User.hasMany(Wishlist, { foreignKey: "userId" });
Wishlist.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Wishlist, { foreignKey: "productId" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });

export default Wishlist;
