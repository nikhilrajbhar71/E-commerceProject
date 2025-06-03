import express from "express";
import {
  addAddress,
  deleteAddress,
  getAllAddresses,
  setAddressToDefault,
  updateAddress,
} from "../controllers/user.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateAddAddress } from "../middleware/validators/users/validateAddress.js";
import { validateAddressId } from "../middleware/validators/users/validateAddressId.js";
import { validateOptionalAddressFields } from "../middleware/validators/users/validateAddressUpdate.js";

const addressRouter = express.Router();

addressRouter.post("/", validateAddAddress, authenticateUser, addAddress);
addressRouter.get("/all", authenticateUser, getAllAddresses);
addressRouter.delete(
  "/:id",
  validateAddressId,
  authenticateUser,
  deleteAddress
);
addressRouter.put(
  "/:id",
  validateAddressId,
  validateOptionalAddressFields,
  authenticateUser,
  updateAddress
);
addressRouter.put("/default/:id", validateAddressId,authenticateUser,setAddressToDefault);

export default addressRouter;
