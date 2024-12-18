import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./GatewayStyles.css";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";

const GatewayPage = () => {
  const [auth] = useAuth();
  const [cart] = useCart();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Calculate the total price of the cart
  useEffect(() => {
    const calculateTotal = () => {
      let sum = 0;
      cart?.forEach((item) => {
        sum += item.price;
      });
      setTotal(sum);
    };
    calculateTotal();
  }, [cart]);

  const proceedToPayment = async () => {
    if (!auth?.token) {
      toast.error("Please log in to proceed with the payment.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        products: cart.map((item) => item._id), // Use product IDs from cart
        payment: {
          method: "Credit/Debit Card", // Example, replace with actual payment method
          amount: total,
        },
        buyer: auth?.user?._id, // Authenticated user's ID
      };

      // API call to create the order
      const response = await axios.post(
        "http://localhost:8080/api/v1/order/create", // Correct backend's API endpoint
        orderData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Pass user token in the headers
          },
        }
      );

      // Handle success
      if (response.data) {
        toast.success("Order created successfully!");
        setTimeout(() => {
          navigate("/dashboard/user/orders"); // Redirect to orders page or confirmation page
        }, 1500);
      }
    } catch (error) {
      // Handle errors
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="gateway-container">
        <div className="gateway-card">
          <div className="gateway-header">
            <img
              src="https://newsroom.paypal-corp.com/image/pp_h_rgb_logo_tn.jpg" // Replace with your logo
              alt="Payment Gateway"
              className="gateway-logo"
            />
            <h2 className="gateway-title">Checkout with Confidence</h2>
          </div>
          <div className="gateway-body">
            <h4>Order Summary</h4>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cart.length || 0}</span>
            </div>
            <div className="summary-row">
              <span>Total Price:</span>
              <span>
                {total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
            <hr />
            <div className="payment-info">
              <h5>Payment Methods</h5>
              <ul>
                <li>💳 Credit/Debit Card</li>
                <li>🛡️ Secure Transactions</li>
                <li>🌐 PayPal Integration</li>
              </ul>
            </div>
          </div>
          <div className="gateway-footer">
            <button
              className="btn btn-primary gateway-btn"
              onClick={proceedToPayment}
            >
              Continue to Payment
            </button>
            <button
              className="btn btn-secondary gateway-btn"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GatewayPage;
