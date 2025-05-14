import {
  addItemsToCart,
  createCart,
  deleteCartItem,
  findCartByUserId,
  findCartIfExists,
  findCartItemIfExists,
  updateItemCountService,
  verifyCartOwnership,
} from "../services/cart.service.js";

import responseHandler from "../utils/responseHandler.js";

export const addItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = req.body.products;
    //  we will create cart right away , if cart doesn't exit.
    let cart = await findCartByUserId(userId);
    if (!cart) {
      cart = await createCart(userId);
    }
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
    return responseHandler(res, 200, "Items added to the cart", cart);
  } catch (error) {
    next(error);
  }
};

export const updateItemsCount = async (req, res, next) => {
  const { cartItemId, operation } = req.body;
  const cartItem = await findCartItemIfExists(cartItemId);
  verifyCartOwnership(cartItem, req.user.id);
  await updateItemCountService(operation, cartItem);

  return responseHandler(res, 200, "Items updated in the cart", {});
};

export const deleteItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await deleteCartItem(cartItemId);
    return responseHandler(res, 200, "Items updated in the cart", {});
  } catch (error) {}
};
