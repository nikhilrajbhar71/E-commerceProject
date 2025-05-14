import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./product.model.js";

const ProductVariant = sequelize.define("ProductVariant", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
});

Product.hasMany(ProductVariant, {
  foreignKey: "productId",
  as: "variants",
  onDelete: "CASCADE",
});
ProductVariant.belongsTo(Product, {
  foreignKey: "productId",
});

export default ProductVariant;
