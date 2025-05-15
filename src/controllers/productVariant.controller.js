import VariantResource from "../resources/variant.resource.js";
import {
  checkIfVariantExists,
  createVariantService,
  deleteVariantService,
  findAllVariants,
  findProductByPkAndUserId,
  findVariantWithProduct,
  updateVariantService,
  verifyVariantOwnership,
} from "../services/product.service.js";
import responseHandler from "../utils/responseHandler.js";

export const createVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO : user can send whole array of variants, as adding one by one would be irritating.
    const { color, size, price, stock, sku } = req.body;
    const product = await findProductByPkAndUserId(id, req.user.id);
    await checkIfVariantExists(size, color, product.id);
    // we are already creating an array, we just need to change the input format, then we can directly use array
    const variants = [
      {
        color,
        size,
        price,
        stock,
        sku,
      },
    ];
    await createVariantService(variants, product.id);

    return responseHandler(res, 200, "Variant added successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getVariantsByProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const variants = await findAllVariants(id);
    return responseHandler(
      res,
      200,
      "Fetched all variants",
      VariantResource.groupBySize(variants)
    );
  } catch (error) {
    next(error);
  }
};

export const updateVariant = async (req, res, next) => {
  try {
    const variantId = req.params.id;

    const variant = await findVariantWithProduct(variantId);
    verifyVariantOwnership(variant, req.user.id);

    await updateVariantService(variant, req.body);
    return responseHandler(res, 200, "Variant updated successfully", {});
  } catch (error) {
    next(error);
  }
};

export const deleteVariant = async (req, res, next) => {
  try {
    const variantId = req.params.id;
    const variant = await findVariantWithProduct(variantId);
    verifyVariantOwnership(variant, req.user.id);
    await deleteVariantService(variant, req.user.id);
    return responseHandler(res, 200, "variant deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
