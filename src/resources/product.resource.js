import Resource from "resources.js";

class ProductResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      name: this.name || "",
      description: this.description || "",
      price: Number(this.price) || 0,
      bannerImage: this.bannerImage || "",
      rating: this.rating?.toString() || "0.0",
      reviewCount: Number(this.reviewCount) || 0,
      isActive: Boolean(this.isActive),
      isDeleted: Boolean(this.isDeleted),
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      categoryId: Number(this.categoryId) || null,
      sellerId: Number(this.sellerId) || null,
      variants:
        Array.isArray(this.variants) && this.variants.length > 0
          ? this.groupVariantsBySize(this.variants)
          : undefined,
    };
  }

  groupVariantsBySize(variants) {
    const grouped = {};

    for (const variant of variants) {
      const size = variant.size || "UNKNOWN";

      if (!grouped[size]) grouped[size] = [];

      grouped[size].push({
        id: Number(variant.id) || 0,
        color: variant.color || "",
        price: variant.price?.toString() || "0",
        stock: Number(variant.stock) || 0,
        sku: variant.sku || "",
      });
    }

    return grouped;
  }
}

export default ProductResource;
