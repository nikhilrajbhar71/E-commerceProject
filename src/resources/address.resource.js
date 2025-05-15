import Resource from "resources.js";

class AddressResource extends Resource {
  toArray() {
    return {
      id: Number(this.id) || 0,
      label: this.label || "",
      line: this.line || "",
      city: this.city || "",
      state: this.state || "",
      postal_code: this.postalCode || "",
      country: this.country || "",
      isDefault: this.isDefault || false,
      created_at: this.createdAt || "",
      updated_at: this.updatedAt || "",
    };
  }

  static collection(dataArray) {
    return dataArray.map((item) => new this(item).toArray());
  }
}

export default AddressResource;
