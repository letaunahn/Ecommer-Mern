import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getAllProducts,
  getProductDetails,
  getProductReviews,
  updateProduct,
} from "../controllers/productController.js";
import { authorizeRoles, isAuthenticateUser } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.get("/all", isAuthenticateUser, getAllProducts);
productRouter.post(
  "/add",
  isAuthenticateUser,
  authorizeRoles("admin"),
  createProduct
);
productRouter.put(
  "/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  updateProduct
);
productRouter.delete(
  "/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  deleteProduct
);
productRouter.get("/:id", getProductDetails);
productRouter.post("/review", isAuthenticateUser, createProductReview)
productRouter.get('/:id/reviews', getProductReviews)
productRouter.post('/reviews', isAuthenticateUser, deleteProductReview)

export default productRouter;
