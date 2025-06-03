import responseHandler from "../utils/responseHandler.js";

const verifySeller = async (req, res, next) => {
  try {
    if (req.user.role != "seller") {
      return responseHandler(
        res,
        401,
        "Unauthorized",
        {},
        "Forbidden - User is not an seller"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default verifySeller;
