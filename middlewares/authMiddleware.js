import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token-based middleware
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("Token received:", token);

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decode = JWT.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).send({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// Admin access middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    console.log("user", user);

    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Forbidden: Admin access required.",
      });
    }
    next();
  } catch (error) {
    console.log("Admin Middleware Error:", error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in admin middleware.",
    });
  }
};

// Middleware to ensure user matches the order buyer
export const verifyOrderAccess = async (req, res, next) => {
  try {
    const { buyerId } = req.params; // The buyerId parameter (sent via route)
    if (req.user._id !== buyerId) {
      return res.status(403).send({
        success: false,
        message: "Access denied. You are not authorized to view this order.",
      });
    }
    next();
  } catch (error) {
    console.log("Order Access Middleware Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error verifying order access.",
    });
  }
};
