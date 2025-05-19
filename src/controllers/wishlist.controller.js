import WishlistResource from "../resources/wishlist.resource.js";
import {
  findAllWishlistItems,
  findOrCreateWishlistItems,
  removeItemFromWishlist,
} from "../services/wishlist.service.js";
import responseHandler from "../utils/responseHandler.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { productVariantId } = req.body;
    const userId = req.user.id;
    //TODO : user create of find in cart as well, we are manually checking if cart is present or not
    const [wishlist, created] = await findOrCreateWishlistItems(
      userId,
      productVariantId
    );

    return responseHandler(
      res,
      200,
      created ? "Added to wishlist" : "Already in wishlist",
      {}
    );
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await findAllWishlistItems(userId);

    return responseHandler(
      res,
      200,
      "Fetched wishlist items",
      WishlistResource.collection(wishlist)
    );
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productVariantId } = req.params;

    await removeItemFromWishlist(userId, productVariantId);

    return responseHandler(res, 200, "Item removed from wishlist", {});
  } catch (error) {
    next(error);
  }
};
