import Resource from "resources.js";

class ReviewResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      rating: Number(this.rating) || 0,
      comment: this.comment || "",
      productId: Number(this.productId) || 0,
      userId: Number(this.userId) || 0,
      createdAt: this.createdAt || "",
      user: this.User
        ? {
            id: Number(this.User.id) || 0,
            name: this.User.name || "",
          }
        : "",
    };
  }
}

export default ReviewResource;
