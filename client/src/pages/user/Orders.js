import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Access auth context to get user and token

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/order/user/${auth?.user?._id}`, // Pass authenticated user's buyerId
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Include token for authentication
          },
        }
      );
      setOrders(data.orders); // Ensure `orders` is the key in the response
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token && auth?.user?._id) {
      getOrders(); // Fetch orders when token and user ID are available
    }
  }, [auth?.token, auth?.user?._id]);

  return (
    <Layout title={"Your Orders"}>
      <div
        className="container-fluid p-3 m-3 dashboard"
        style={{
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
          borderRadius: "8px",
        }}
      >
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1
              className="text-center"
              style={{
                marginBottom: "20px",
                color: "#333",
                textDecoration: "underline",
              }}
            >
              All Orders
            </h1>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  className="border shadow mb-4 p-3"
                  key={order._id}
                  style={{ borderRadius: "8px", backgroundColor: "#fff" }}
                >
                  <table className="table" style={{ marginBottom: "15px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#e9ecef" }}>
                        <th scope="col">Order ID</th>
                        <th scope="col">Status</th>
                        {auth?.user?._id == 0 && (
                          <>
                            <th scope="col">Buyer</th>
                          </>
                        )}

                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{order._id}</td>
                        <td
                          style={{
                            color:
                              order.status === "Delivered" ? "green" : "orange",
                          }}
                        >
                          {order.status}
                        </td>
                        {auth?.user?._id == 0 && (
                          <>
                            {" "}
                            <td>{order.buyer?.name}</td>
                          </>
                        )}

                        <td>{moment(order.createdAt).fromNow()}</td>
                        <td
                          style={{
                            color: order.payment?.status ? "green" : "red",
                          }}
                        >
                          {order.payment?.status ? "Success" : "Failed"}
                        </td>
                        <td>{order.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    className="container"
                    style={{ padding: "10px", backgroundColor: "#f7f7f7" }}
                  >
                    {order.products?.map((product, index) => (
                      <div
                        className="row mb-2 p-3 card flex-row"
                        key={product._id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          marginBottom: "10px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <div className="col-md-1">
                          <img
                            src="/images/product/product.jpg"
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                        <div className="col-md-8">
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {product.name}
                          </h5>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            {product.description?.substring(0, 30)}...
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "#000",
                            }}
                          >
                            Price: ₹{product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "50px",
                  fontSize: "18px",
                  color: "#666",
                }}
              >
                No orders found!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
