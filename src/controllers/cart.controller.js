import {
  addItemsToCart,
  createCart,
  deleteCartItem,
  findCartByUserId,
  findCartIfExists,
  findCartItemIfExists,
  findOrCreateCart,
  updateItemCountService,
  verifyCartOwnership,
} from "../services/cart.service.js";

import responseHandler from "../utils/responseHandler.js";

export const addItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = req.body.products;
    //  we will create cart right away , if cart doesn't exist.
    const cart = await findOrCreateCart(userId);
    await addItemsToCart(products, cart);
    return responseHandler(res, 200, "Items added to the cart", {});
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await findCartIfExists(userId);
    return responseHandler(res, 200, "Fetched cart items", cart);
  } catch (error) {
    next(error);
  }
};

export const updateItemsCount = async (req, res, next) => {
  try {
    const { cartItemId, operation } = req.body;
    const cartItem = await findCartItemIfExists(cartItemId);
    verifyCartOwnership(cartItem, req.user.id);
    await updateItemCountService(operation, cartItem);

    return responseHandler(res, 200, "Items updated in the cart", {});
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const cartItem = await findCartItemIfExists(cartItemId);
    verifyCartOwnership(cartItem, req.user.id);
    await deleteCartItem(cartItemId);
    return responseHandler(res, 200, "Items deleted from cart", {});
  } catch (error) {
    next(error);
  }
};
