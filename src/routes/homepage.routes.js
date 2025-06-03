import express from "express";
import { getHomePage } from "../controllers/homepage.controller.js";

const router = express.Router();
router.get("/", getHomePage);
export default router;
