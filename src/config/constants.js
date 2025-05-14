export const httpCodes = {
  OK: 200,
  BAD: 202,
};

export const serverErrorCodes = [400, 401, 500, 404];
export const updatableOrderFields = ["address", "phoneNumber"];
export const allowedAddressFields = [
  "label",
  "line1",
  "line2",
  "city",
  "state",
  "postalCode",
  "country",
];

export const allowedFieldsInProducts = [
  "name",
  "description",
  "price",
  "stock",
  "rating",
  "bannerImage",
  "categoryId",
  "sellerId",
];

export const allowedFieldsInVariants = [
  "color",
  "size",
  "price",
  "stock",
  "sku",
];
