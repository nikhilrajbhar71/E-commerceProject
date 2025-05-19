import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import ProductVariant from "../models/productVariant.model.js";
import AppError from "../utils/AppError.js";
import { findProductByPk } from "./product.service.js";

export const findCartByUserId = async (userId) => {
  const cart = await Cart.findOne({
    where: {
      userId,
    },
    include: CartItem,
  });
  return cart;
};

export const createCart = async (userId) => {
  return await Cart.create({
    userId,
  });
};

export const checkIfVariantExistsInCart = async (
  productId,
  variantId,
  cartId
) => {
  const variant = await CartItem.findOne({
    where: {
      productId,
      variantId,
      cartId,
    },
  });
  return variant;
};
export const addItemsToCart = async (products, cart) => {
  for (const element of products) {
    // check if product exits in db
    await findProductByPk(element.productId);
    // check if variants exists
    const variant = await checkIfVariantExists(
      element.productId,
      element.variantId
    );
    if (variant.stock < element.quantity) {
      throw new AppError(202, "Out of stock");
    }
    const variantAlreadyExists = await checkIfVariantExistsInCart(
      element.productId,
      element.variantId,
      cart.id
    );

    // If same variant of the same product already exists, we will increase the count instead of inserting a new entry

    if (variantAlreadyExists) {
      variantAlreadyExists.quantity += element.quantity;
      await variantAlreadyExists.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        ...element,
      });
    }
  }
};

export const findCartIfExists = async (userId) => {
  const cart = await findCartByUserId(userId);
  if (!cart) {
    throw new AppError(404, "Cart not found");
  }
  return cart;
};

export const verifyCartOwnership = async (cartItem, userId) => {
  if (cartItem.Cart.userId != userId) {
    return responseHandler(res, 401, "Unauthorized", {});
  }
};

export const updateItemCountService = async (operation, cartItem) => {
  if (operation == "add") {
    cartItem.quantity = ++cartItem.quantity;
  } else {
    cartItem.quantity = --cartItem.quantity;
    if (cartItem.quantity == 0) {
      await cartItem.destroy();
    }
  }
  await cartItem.save();
};

export const findCartItemIfExists = async (cartItemId) => {
  const cartItem = await CartItem.findOne({
    where: {
      id: cartItemId,
    },
    include: Cart,
  });
  console.log("cart item " + JSON.stringify(cartItem));
  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }
  return cartItem;
};

export const deleteCartItem = async (cartItemId) => {
  await CartItem.destroy({
    where: {
      id: cartItemId,
    },
  });
};

export const checkIfVariantExists = async (productId, id) => {
  const variant = await ProductVariant.findOne({
    where: {
      productId,
      id,
    },
  });
  if (!variant) {
    throw new AppError(404, "variant not found");
  }
  return variant;
};
