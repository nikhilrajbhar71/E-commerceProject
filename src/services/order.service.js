import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import OrderItem from "../models/orderItem.model.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";
import { updatableOrderFields } from "../config/constants.js";
import { sequelize } from "../config/db.js";
import ProductVariant from "../models/productVariant.model.js";

export const createNewOrder = async (
  products,
  address,
  phoneNumber,
  paymentStatus,
  userId,
  t
) => {
  try {
    const variantData = await Promise.all(
      products.map(({ productId, variantId }) =>
        ProductVariant.findOne({
          where: {
            id: variantId,
            productId: productId,
          },
          include: [{ model: Product }],
          transaction: t,
        })
      )
    );

    let totalAmount = 0;
    const orderItemsData = [];

    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      const variant = variantData[i];

      if (!variant) {
        throw new AppError(
          404,
          `Variant with ID ${item.variantId} for product ${item.productId} not found`
        );
      }

      if (variant.stock < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for product ${variant.Product.name}`
        );
      }

      variant.stock -= item.quantity;
      await variant.save({ transaction: t });

      const itemTotal = variant.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,
        sellerId: variant.Product.sellerId,
        quantity: item.quantity,
        unitPrice: variant.price,
        totalPrice: itemTotal,
      });
    }

    const order = await Order.create(
      {
        userId,
        totalAmount,
        address,
        phoneNumber,
        paymentStatus,
      },
      { transaction: t }
    );

    for (const item of orderItemsData) {
      await OrderItem.create(
        { ...item, orderId: order.id },
        { transaction: t }
      );
    }

    await t.commit();
    return order;
  } catch (err) {
    if (!t.finished) await t.rollback(); 
    throw err;
  }
};

export const findAllOrders = async (userId) => {
  const orders = await Order.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product,
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
};

export const findOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product,
          },
        ],
      },
    ],
  });
  return order;
};

export const deleteOrderById = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem }],
      transaction,
    });
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.productId, { transaction });

      if (product) {
        product.stock += item.quantity;
        await product.save({ transaction });
      }

      await item.destroy({ transaction });
    }

    await order.destroy({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateOrderDetailsService = async (reqBody, order) => {
  for (const field of updatableOrderFields) {
    if (reqBody[field] !== undefined) {
      order[field] = reqBody[field];
    }
  }
  await order.save();
};


