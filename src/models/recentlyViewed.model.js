import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const RecentlyViewed = sequelize.define(
  "RecentlyViewed",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    viewedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);

export default RecentlyViewed;
