import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";
const Address = sequelize.define(
  "Address",
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
    label: {
      type: DataTypes.STRING,
    },
    line1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    line2: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Address.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

User.hasMany(Address, {
  foreignKey: "userId",
  as: "addresses",
});

export default Address;
