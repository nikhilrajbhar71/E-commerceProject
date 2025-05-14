import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import {
  addItemsToCart,
  createCart,
  findCartByUserId,
  findCartIfExists,
  verifyCartOwnership,
} from "../services/cart.service.js";

import responseHandler from "../utils/responseHandler.js";

export const addItems = async (req, res) => {
  const userId = req.user.id;
  const products = req.body.products;
  let cart = await findCartByUserId(userId);
  if (!cart) {
    cart = await createCart(userId);
  }
  await addItemsToCart(products, cart);
  return responseHandler(res, 200, "Items added to the cart", {});
};

export const getCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await findCartIfExists(userId);
  return responseHandler(res, 200, "Items added to the cart", cart);
};

export const updateItemsCount = async (req, res) => {
  const { cartItemId, operation } = req.body;
  const cartItem = await findCartIfExists(req.user.id);
  verifyCartOwnership(cartItem, req.user.id);
  if (operation == "add") {
    cartItem.quantity = ++cartItem.quantity;
  } else {
    cartItem.quantity = --cartItem.quantity;
    if (cartItem.quantity == 0) {
      await cartItem.destroy();
    }
  }
  await cartItem.save();

  return responseHandler(res, 200, "Items updated in the cart", {});
};

export const deleteItem = async (req, res) => {
  const cartItemId = req.params.id;
  await CartItem.destroy({
    where: {
      id: cartItemId,
    },
  });

  return responseHandler(res, 200, "Items updated in the cart", {});
};
