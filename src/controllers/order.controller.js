import responseHandler from "../utils/responseHandler.js";
import {
  createNewOrder,
  deleteOrderById,
  findAllOrders,
  findOrderById,
  updateOrderDetailsService,
} from "../services/order.service.js";

import Order from "../models/order.model.js";
import { findCartByUserId } from "../services/cart.service.js";
import { fetchAddressById } from "../services/user.service.js";
import OrderResource from "../resources/order.resource.js";

export const createOrder = async (req, res, next) => {
  const t = await Order.sequelize.transaction();
  try {
    const { addressId, phoneNumber, paymentStatus } = req.body;
    const userId = req.user.id;
    await fetchAddressById(addressId);
    // Question : DO I NEED TO VERIFY IF THE ADDRESS BELONGS TO THAT USER
    const cart = await findCartByUserId(userId);
    if (cart.CartItems.length < 1) {
      return responseHandler(res, 202, "No items in cart", {});
    }
    const order = await createNewOrder(
      cart.CartItems,
      addressId,
      phoneNumber,
      paymentStatus,
      userId,
      t
    );
    await t.commit();

    return responseHandler(res, 200, "Order placed successfully", {
      orderId: order.id,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await findAllOrders(req.user.id);

    return responseHandler(
      res,
      200,
      "Fetched order successfully",
      OrderResource.collection(orders)
    );
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await findOrderById(id);
    return responseHandler(
      res,
      200,
      "Order fetched successfully",
      new OrderResource(order).exec()
    );
  } catch (error) {
    next(error);
  }
};

export const updateOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await findOrderById(id);

    await updateOrderDetailsService(req.body, order);
    return responseHandler(res, 200, "Order updated successfully", order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteOrderById(id);
    return responseHandler(res, 200, "Order deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
