export default class ProductResource {
  constructor(product) {
    this.product = product;
  }

  // Format single variant object
  formatVariant(variant) {
    return {
      id: variant.id,
      color: variant.color,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      sku: variant.sku,
    };
  }

  // Format product object with variants
  formatProduct(product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      bannerImage: product.bannerImage,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isActive: product.isActive,
      isDeleted: product.isDeleted,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      variants: Array.isArray(product.variants)
        ? product.variants.map((variant) => this.formatVariant(variant))
        : [],
    };
  }

  // Main method to get formatted product including relatedProducts
  toArray() {
    const formattedProduct = this.formatProduct(this.product);

    if (Array.isArray(this.product.relatedProducts)) {
      formattedProduct.relatedProducts = this.product.relatedProducts.map(
        (relatedProduct) => this.formatProduct(relatedProduct)
      );
    } else {
      formattedProduct.relatedProducts = [];
    }

    return formattedProduct;
  }
}
