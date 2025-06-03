import Resource from "resources.js";

class VariantResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      productId: Number(this.productId) || 0,
      color: this.color || "",
      size: this.size || "",
      price: this.price?.toString() || "0",
      stock: Number(this.stock) || 0,
      sku: this.sku || "",
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
    };
  }

  static groupBySize(variants = []) {
    const grouped = {};
    for (const variant of variants) {
      const size = variant.size || "UNKNOWN";
      if (!grouped[size]) grouped[size] = [];
      grouped[size].push(new VariantResource(variant).toArray());
    }
    return grouped;
  }
}

export default VariantResource;
