import Resource from "resources.js";

class CartResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      userId: Number(this.userId) || 0,
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      totalAmount: Number(this.totalAmount) || 0, 

      cartItems: Array.isArray(this.CartItems)
        ? this.CartItems.map((item) => ({
            id: Number(item.id) || 0,
            cartId: Number(item.cartId) || 0,
            productId: Number(item.productId) || 0,
            variantId: Number(item.variantId) || 0,
            quantity: Number(item.quantity) || 0,
            createdAt: item.createdAt || "",
            updatedAt: item.updatedAt || "",
            product: item.Product
              ? {
                  id: Number(item.Product.id) || 0,
                  name: item.Product.name || "",
                  description: item.Product.description || "",
                  price: Number(item.Product.price) || 0,
                  bannerImage: item.Product.bannerImage || "",
                  rating: item.Product.rating || "",
                  reviewCount: item.Product.reviewCount || 0,
                  isActive: Boolean(item.Product.isActive),
                  isDeleted: Boolean(item.Product.isDeleted),
                  createdAt: item.Product.createdAt || "",
                  updatedAt: item.Product.updatedAt || "",
                  categoryId: Number(item.Product.categoryId) || 0,
                  sellerId: Number(item.Product.sellerId) || 0,
                  variant: item.ProductVariant
                    ? {
                        id: Number(item.ProductVariant.id) || 0,
                        productId: Number(item.ProductVariant.productId) || 0,
                        color: item.ProductVariant.color || "",
                        size: item.ProductVariant.size || "",
                        price: Number(item.ProductVariant.price) || 0,
                        stock: Number(item.ProductVariant.stock) || 0,
                        sku: item.ProductVariant.sku || "",
                        createdAt: item.ProductVariant.createdAt || "",
                        updatedAt: item.ProductVariant.updatedAt || "",
                      }
                    : null,
                }
              : null,
          }))
        : [],
    };
  }
}

export default CartResource;
