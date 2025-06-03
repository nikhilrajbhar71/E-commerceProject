import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const BlacklistedToken = sequelize.define(
  "BlacklistedToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default BlacklistedToken;
