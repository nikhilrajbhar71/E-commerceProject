import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import Wishlist from "../models/wishlist.model.js";
import AppError from "../utils/AppError.js";

export const findOrCreateWishlistItems = async (userId, productVariantId) => {
  const [wishlist, created] = await Wishlist.findOrCreate({
    where: { userId, productVariantId },
  });
  return [wishlist, created];
};

export const findAllWishlistItems = async (userId) => {
  const wishlist = await Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: ProductVariant,
        include: [{ model: Product }],
      },
    ],
  });
  return wishlist;
};

export const removeItemFromWishlist = async (userId, productVariantId) => {
  const deleted = await Wishlist.destroy({
    where: { userId, productVariantId },
  });
  if (!deleted) {
    throw new AppError(202, "Item couldn't be deleted");
  }
};
