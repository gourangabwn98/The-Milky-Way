import Order from "../models/orderModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { products, payment, buyer } = req.body;

    if (!products || !buyer) {
      return res
        .status(400)
        .send({ error: "Products and buyer are required." });
    }

    const newOrder = new Order({
      products,
      payment,
      buyer,
    });

    await newOrder.save();
    res
      .status(201)
      .send({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).send({ error: "Failed to create order" });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products")
      .populate("buyer", "name email")
      .exec();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch orders" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({ error: "Order not found" });
    }

    res
      .status(200)
      .send({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).send({ error: "Failed to update order status" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const orders = await Order.find({ buyer: buyerId })
      .populate("products", "name price")
      .populate("buyer", "name email")
      .exec();

    res.status(200).send({
      success: true,
      message: "User orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch user orders",
      error,
    });
  }
};
