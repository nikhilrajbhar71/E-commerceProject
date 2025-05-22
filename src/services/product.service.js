import { Sequelize } from "sequelize";
import AppError from "../utils/AppError.js";

import Product from "../models/product.model.js";
import { Op } from "sequelize";
import ProductVariant from "../models/productVariant.model.js";
import {
  allowedFieldsInProducts,
  allowedFieldsInVariants,
} from "../config/constants.js";
import redisClient from "../utils/redisClient.js";
import RecentlyViewed from "../models/recentlyViewed.model.js";

export const createNewProduct = async (
  name,
  description,
  price,
  rating,
  bannerImage,
  categoryId,
  sellerId,
  isActive,
  isDeleted,
  transaction
) => {
  return await Product.create(
    {
      name,
      description,
      price,
      rating,
      bannerImage,
      categoryId,
      sellerId,
      isActive,
      isDeleted,
    },
    { transaction }
  );
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

export const getFilteredProducts = async (
  category,
  size,
  color,
  minPrice,
  maxPrice,
  sort,
  recent,
  userId,
  page = 1,
  limit = 20
) => {
  const where = {};
  const variantWhere = {};
  let recentIds = null;

  // Add recently viewed filter
  if (recent == "true" && userId) {
    const key = `recently_viewed:${userId}`;
    recentIds = await redisClient.lRange(key, 0, 19);

    if (!recentIds || recentIds.length === 0) {
      const fallback = await RecentlyViewed.findAll({
        where: { userId },
        order: [["viewedAt", "DESC"]],
        limit: 20,
      });
      recentIds = fallback.map((view) => view.productId);

      if (recentIds.length > 0) {
        await redisClient.del(key);
        await redisClient.rPush(key, ...recentIds);
      }
    }

    where.id = { [Op.in]: recentIds };
  }

  // Category filter
  if (category) {
    where.categoryId = category;
  }

  // Price filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  // Variant filters
  if (size) variantWhere.size = size;
  if (color) variantWhere.color = color;

  // Sorting
  let order = [["createdAt", "DESC"]];
  if (sort === "price_asc") order = [["price", "ASC"]];
  if (sort === "price_desc") order = [["price", "DESC"]];

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.findAll({
    where,
    include: [
      {
        model: ProductVariant,
        as: "variants",
        where: variantWhere,
      },
    ],
    order,
    limit: parseInt(limit),
    offset,
  });

  return {
    products,
    total: finalProducts.length,
    page: parseInt(page),
    totalPages: Math.ceil(finalProducts.length / limit),
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

export const createVariantService = async (
  variantsArray,
  productId,
  transaction
) => {
  await Promise.all(
    variantsArray.map(async ({ color, size, price, stock, sku }) => {
      await checkIfVariantExists(size, color, productId);
      return ProductVariant.create(
        {
          productId,
          color,
          size,
          price,
          stock,
          sku,
        },
        { transaction }
      );
    })
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

export const fetchProductForHomePage = async (limit) => {
  return await Product.findAll({ limit });
};
