import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import ProductVariant from "./productVariant.model.js";
import User from "./user.model.js";

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
    productVariantId: {
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

ProductVariant.hasMany(Wishlist, { foreignKey: "productVariantId" });
Wishlist.belongsTo(ProductVariant, { foreignKey: "productVariantId" });

export default Wishlist;
