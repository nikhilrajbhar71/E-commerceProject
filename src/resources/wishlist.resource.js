import Resource from "resources.js";

class WishlistResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      userId: Number(this.userId) || 0,
      productId: Number(this.productId) || 0,
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      product: this.ProductVariant?.Product
        ? this.formatProduct(this.ProductVariant.Product, this.ProductVariant)
        : null,
    };
  }

  formatProduct(product, variant) {
    return {
      id: Number(product.id) || 0,
      name: product.name || "",
      description: product.description || "",
      price: Number(product.price) || 0,
      bannerImage: product.bannerImage || "",
      rating: product.rating?.toString() || "0.0",
      reviewCount: Number(product.reviewCount) || 0,
      isActive: Boolean(product.isActive),
      isDeleted: Boolean(product.isDeleted),
      createdAt: product.createdAt || "",
      updatedAt: product.updatedAt || "",
      categoryId: Number(product.categoryId) || null,
      sellerId: Number(product.sellerId) || null,
      variant: {
        id: Number(variant.id) || 0,
        productId: Number(variant.productId) || 0,
        color: variant.color || "",
        size: variant.size || "",
        price: variant.price?.toString() || "0",
        stock: Number(variant.stock) || 0,
        sku: variant.sku || "",
        createdAt: variant.createdAt || "",
        updatedAt: variant.updatedAt || "",
      },
    };
  }
}

export default WishlistResource;
