import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";
import BlacklistedToken from "../models/blacklistedToken.model.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    const isBlacklisted = await BlacklistedToken.findOne({
      where: {
        token,
      },
    });

    if (isBlacklisted) {
      return responseHandler(res, 401, "Token is expired", {});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new AppError(401, "Forbidden - Invalid Token");
    }
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return responseHandler(res, 404, "user not found", {});
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
