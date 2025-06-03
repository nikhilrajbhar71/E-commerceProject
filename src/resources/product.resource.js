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

  // Group variants by size
  groupVariantsBySize(variants) {
    return variants.reduce((acc, variant) => {
      const size = variant.size;
      if (!acc[size]) {
        acc[size] = [];
      }
      acc[size].push(this.formatVariant(variant));
      return acc;
    }, {});
  }

  // Format product object with variants
  formatProduct(product) {
    const formattedVariants = Array.isArray(product.variants)
      ? product.variants.map((variant) => this.formatVariant(variant))
      : [];

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

      variantsBySize: this.groupVariantsBySize(product.variants || []),
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
