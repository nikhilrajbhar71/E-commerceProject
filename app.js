import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/products.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import variantRoutes from "./src/routes/variants.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import wishlistRoutes from "./src/routes/wishlist.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import homepageRoutes from "./src/routes/homepage.routes.js";
import dotenv from "dotenv";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/homepage",homepageRoutes);
app.use(errorMiddleware);

export default app;
