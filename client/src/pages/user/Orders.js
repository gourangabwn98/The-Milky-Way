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
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div className="border shadow mb-4" key={order._id}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{order._id}</td>
                        <td>{order.status}</td>
                        <td>{order.buyer?.name}</td>
                        <td>{moment(order.createdAt).fromNow()}</td>
                        <td>{order.payment?.success ? "Success" : "Failed"}</td>
                        <td>{order.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {order.products?.map((product, index) => (
                      <div
                        className="row mb-2 p-3 card flex-row"
                        key={product._id}
                      >
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            className="card-img-top"
                            width="100px"
                            height="100px"
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{product.name}</p>
                          <p>{product.description?.substring(0, 30)}...</p>
                          <p>Price: ₹{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found!</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
