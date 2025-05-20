import responseHandler from "../utils/responseHandler.js";
import {
  createNewProduct,
  createVariantService,
  deleteProductById,
  fetchAllProducts,
  findProductByPkAndUserId,
  getProductWithVariant,
  updateProductService,
  updateProductStatus,
} from "../services/product.service.js";
import ProductResource from "../resources/product.resource.js";
import { sequelize } from "../config/db.js";

export const createProduct = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const {
      name,
      description,
      price,
      rating,
      categoryId,
      isActive,
      isDeleted,
    } = req.body;

    const variants = JSON.parse(req.body.variants);

    const sellerId = req.user.id;
    if (!req.file) {
      return responseHandler(res, 200, "Banner image is required", {});
    }
    const bannerImage = req.file.location;
    const product = await createNewProduct(
      name,
      description,
      price,
      rating,
      bannerImage,
      categoryId,
      sellerId,
      isActive,
      isDeleted,
      t
    );
    const productWithVariant = await createVariantService(
      variants,
      product.id,
      t
    );
    await t.commit();
    responseHandler(
      res,
      200,
      "product created successfully",
      new ProductResource(productWithVariant).exec()
    );
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
   // TODO : we can do this in a single db call
    await findProductByPkAndUserId(id, req.user.id);
    await updateProductStatus(id);

    return responseHandler(res, 200, "Product status updated successfully", {});
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    //we can combine this alsos
    await findProductByPkAndUserId(req.params.id, req.user.id);

    await deleteProductById(req.params.id);

    return responseHandler(res, 200, "product status deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, category, seller, minPrice, maxPrice } = req.query;
    // Question : Do we need to send product variant with all products as it would increase the load on query + data
    const product = await fetchAllProducts(
      page,
      limit,
      category,
      seller,
      minPrice,
      maxPrice
    );

    return responseHandler(res, 200, "All products fetched successfully", {
      ...product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await getProductWithVariant(productId);

    return responseHandler(
      res,
      200,
      "Product fetched successfully",
      new ProductResource(product).exec()
    );
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await findProductByPkAndUserId(id, req.user.id);

    await updateProductService(product, req.body);

    return responseHandler(res, 200, "Updated successfully", {});
  } catch (error) {
    next(error);
  }
};
