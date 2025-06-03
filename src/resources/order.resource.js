import Resource from "resources.js";

class OrderResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      userId: Number(this.userId) || 0,
      totalAmount: Number(this.totalAmount) || 0,
      addressId: Number(this.addressId) || 0,
      phoneNumber: this.phoneNumber || "",
      paymentStatus: this.paymentStatus || "",
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      orderItems:
        this.OrderItems?.map((item) => ({
          id: Number(item.id) || 0,
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          totalPrice: Number(item.totalPrice) || 0,
          status: item.status || "",
          product: item.Product
            ? {
                id: Number(item.Product.id) || 0,
                name: item.Product.name || "",
                description: item.Product.description || "",
                price: Number(item.Product.price) || 0,
                bannerImage: item.Product.bannerImage || "",
                rating: item.Product.rating || "0.0",
                reviewCount: Number(item.Product.reviewCount) || 0,
                isActive: !!item.Product.isActive,
                isDeleted: !!item.Product.isDeleted,

                categoryId: Number(item.Product.categoryId) || 0,
                sellerId: Number(item.Product.sellerId) || 0,
                variant: item.ProductVariant
                  ? {
                      id: Number(item.ProductVariant.id) || 0,
                      color: item.ProductVariant.color || "",
                      size: item.ProductVariant.size || "",
                      price: Number(item.ProductVariant.price) || 0,
                      stock: Number(item.ProductVariant.stock) || 0,
                      sku: item.ProductVariant.sku || "",
                    }
                  : null,
              }
            : null,
        })) || [],
    };
  }
}

export default OrderResource;
