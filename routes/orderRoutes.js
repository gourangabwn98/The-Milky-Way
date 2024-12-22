import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getUserOrders,
  getUserOrdersfromAdmin,
} from "../controllers/orderController.js";

import {
  isAdmin,
  requireSignIn,
  verifyOrderAccess,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new order
router.post("/create", requireSignIn, createOrder);

// Route to get all orders (admin-level)

router.get("/all-orders", requireSignIn, isAdmin, getAllOrders);

// Route to update an order's status
router.put("/status/:orderId", requireSignIn, isAdmin, updateOrderStatus);

// Route to get orders for the logged-in user
router.get("/user/:buyerId", requireSignIn, verifyOrderAccess, getUserOrders);
// this is for admin for count user order individually
router.get("/:buyerId", requireSignIn, getUserOrdersfromAdmin);

export default router;
