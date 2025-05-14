import Cart from "../models/cart.model.js";
import AppError from "../utils/AppError.js";

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

export const addItemsToCart = async (products, cart) => {
  products.forEach(async (element) => {
    await CartItem.create({
      cartId: cart.id,
      ...element,
    });
  });
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


export const updateItemCount = async()=>{
  if (operation == "add") {
    cartItem.quantity = ++cartItem.quantity;
  } else {
    cartItem.quantity = --cartItem.quantity;
    if (cartItem.quantity == 0) {
      await cartItem.destroy();
    }
  }
  await cartItem.save();
}