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

export const createOrder = async (req, res, next) => {
  try {
    const t = await Order.sequelize.transaction();
    const { addressId, phoneNumber, paymentStatus } = req.body;
    const userId = req.user.id;
    await fetchAddressById(addressId);
    // Question : DO I NEED TO VERIFY IF THE ADDRESS BELONGS TO THAT USER
    const cart = await findCartByUserId(userId);
    const order = await createNewOrder(
      cart.CartItems,
      addressId,
      phoneNumber,
      paymentStatus,
      userId,
      t
    );
    return responseHandler(res, 200, "Order placed successfully", {
      orderId: order.id,
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await findAllOrders(req.user.id);

    return responseHandler(res, 200, "Fetched order successfully", orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await findOrderById(id);
    return responseHandler(res, 200, "Order fetched successfully", order);
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
