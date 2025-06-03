import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const OtpModel = sequelize.define("Otp", {
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default OtpModel;
