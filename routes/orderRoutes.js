import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getUserOrders,
} from "../controllers/orderController.js";

import {
  requireSignIn,
  verifyOrderAccess,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new order
router.post("/create", requireSignIn, createOrder);

// Route to get all orders (admin-level)
router.get("/", requireSignIn, getOrders);

// Route to update an order's status
router.put("/:orderId/status", requireSignIn, updateOrderStatus);

// Route to get orders for the logged-in user
router.get("/user/:buyerId", requireSignIn, verifyOrderAccess, getUserOrders);

export default router;
