import responseHandler from "../utils/responseHandler.js";
import {
  createNewProduct,
  createVariantService,
  deleteProductById,
  findProductByPkAndUserId,
  getFilteredProducts,
  getProductWithVariant,
  updateProductService,
  updateProductStatus,
} from "../services/product.service.js";
import ProductResource from "../resources/product.resource.js";
import { sequelize } from "../config/db.js";
import { trackRecentlyViewed } from "../utils/trackRecentlyViewed.js";

export const createProduct = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { name, description, price, categoryId } = req.body;

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
      bannerImage,
      categoryId,
      sellerId,

      t
    );
    const productWithVariant = await createVariantService(
      variants,
      product.id,
      t
    );
    //  TODO : to send product with variant,will do i on next working day
    await t.commit();
    responseHandler(res, 200, "product created successfully", product);
  } catch (error) {
    console.log("error is " + JSON.stringify(error.message));
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
    //we can combine this also
    await findProductByPkAndUserId(req.params.id, req.user.id);

    await deleteProductById(req.params.id);

    return responseHandler(res, 200, "product  deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      recent,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const product = await getFilteredProducts(
      category,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      recent,
      req.user?.id,
      page,
      limit,
      search
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
    if (req.user) {
      await trackRecentlyViewed(req.user.id, productId);
    }

    return responseHandler(
      res,
      200,
      "Product fetched successfully",
      new ProductResource(product).toArray()
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
