import { Sequelize } from "sequelize";
import AppError from "../utils/AppError.js";
import ProductResource from "../resources/product.resource.js";

import Product from "../models/product.model.js";
import { Op } from "sequelize";
import ProductVariant from "../models/productVariant.model.js";
import {
  allowedFieldsInProducts,
  allowedFieldsInVariants,
} from "../config/constants.js";

export const createNewProduct = async ({
  name,
  description,
  price,
  rating,
  bannerImage,
  categoryId,
  sellerId,
  isActive,
  isDeleted,
}) => {
  return await Product.create({
    name,
    description,
    price,
    rating,
    bannerImage,
    categoryId,
    sellerId,
    isActive,
    isDeleted,
  });
};

export const findProductByPk = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  return product;
};

export const findProductByPkAndUserId = async (id, sellerId) => {
  const product = await Product.findOne({
    where: {
      id,
      sellerId,
    },
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  return product;
};
export const updateProductStatus = async (id) => {
  await Product.update(
    { isActive: Sequelize.literal("NOT isActive") },
    { where: { id } }
  );
};

export const deleteProductById = async (id) => {
  await Product.update({ isDeleted: true }, { where: { id } });
};

export const fetchAllProducts = async (
  page,
  limit,
  category,
  seller,
  minPrice,
  maxPrice
) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const whereCondition = {
    isActive: true,
    isDeleted: false,
  };

  if (category) whereCondition.categoryId = category;
  if (seller) whereCondition.sellerId = seller;

  if (minPrice || maxPrice) {
    whereCondition.price = {};
    if (minPrice) whereCondition.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) whereCondition.price[Op.lte] = parseFloat(maxPrice);
  }

  const totalCount = await Product.count({ where: whereCondition });
  const totalPages = Math.ceil(totalCount / limit);

  const products = await Product.findAll({
    limit,
    offset,
    where: whereCondition,

    order: [["createdAt", "DESC"]],
  });

  return {
    products: ProductResource.collection(products),
    currentPage: page,
    totalPages,
  };
};

export const verifyProductOwnership = (product, userId) => {
  if (!product || product.sellerId !== userId.id) {
    throw new AppError(401, "Unauthorized to perform this action");
  }
};

export const getProductWithVariant = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [
      {
        model: ProductVariant,
        attributes: ["id", "color", "size", "price", "stock", "sku"],
        as: "variants",
      },
    ],
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  return product;
};

export const updateProductService = async (product, reqBody) => {
  for (const field of allowedFieldsInProducts) {
    if (reqBody[field] !== undefined) {
      product[field] = reqBody[field];
    }
  }

  await product.save();
};

export const createVariantService = async (variantsArray, productId) => {
  await Promise.all(
    variantsArray.map(({ color, size, price, stock, sku }) =>
      ProductVariant.create({
        productId,
        color,
        size,
        price,
        stock,
        sku,
      })
    )
  );
};

export const findAllVariants = async (productId) => {
  return await ProductVariant.findAll({ where: { productId } });
};

export const checkIfVariantExists = async (size, color, productId) => {
  const variant = await ProductVariant.findOne({
    where: {
      size,
      color,
      productId,
    },
  });
  if (variant) {
    throw new AppError(200, "Variant already exists,Kindly update that");
  }
};

export const findVariantWithProduct = async (id) => {
  const variant = await ProductVariant.findByPk(id, {
    include: Product,
  });
  if (!variant) {
    throw new AppError(200, "Variant doesn't  exist");
  }
  return variant;
};

export const deleteVariantService = async (variant, userId) => {
  verifyVariantOwnership(variant, userId);
  await variant.destroy();
};

export const verifyVariantOwnership = (variant, userId) => {
  console.log("variant" + JSON.stringify(variant));
  console.log("user id " + JSON.stringify(userId));
  if (variant?.Product?.sellerId != userId) {
    throw new AppError(401, "Unauthorized", {});
  }
};

export const updateVariantService = async (variant, reqBody) => {
  for (const field of allowedFieldsInVariants) {
    if (reqBody[field] != undefined) {
      variant[field] = reqBody[field];
    }
  }
  await variant.save();
};
