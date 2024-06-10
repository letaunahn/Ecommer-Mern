import express from "express";
import { authorizeRoles, isAuthenticateUser } from "../middleware/auth.js";
import {
    deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/create", isAuthenticateUser, newOrder);
orderRouter.get(
  "/admin/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  getSingleOrder
);
orderRouter.get("/orders/me", isAuthenticateUser, myOrders);
orderRouter.post(
  "/admin/orders",
  isAuthenticateUser,
  authorizeRoles("admin"),
  getAllOrders
);
orderRouter.post(
  "/admin/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  updateOrder
);
orderRouter.delete('/admin/:id', isAuthenticateUser, authorizeRoles('admin'), deleteOrder)
export default orderRouter;
