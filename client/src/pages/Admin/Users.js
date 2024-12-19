import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users and their order count
  const fetchUsers = async () => {
    try {
      const { data: userData } = await axios.get(
        "http://localhost:8080/api/v1/auth/all-users"
      );

      const usersWithOrders = await Promise.all(
        userData.map(async (user) => {
          try {
            // Fetch order count for each user dynamically
            const { data: orderData } = await axios.get(
              `http://localhost:8080/api/v1/order/user/${user._id}`
            );
            console.log("c", orderData.data.totalOrders);

            return { ...user, orderCount: orderData.data.totalOrders || 0 };
          } catch (orderError) {
            console.error(
              `Error fetching orders for user ${user._id}:`,
              orderError
            );
            return { ...user, orderCount: 0 }; // Default to 0 orders if there's an error
          }
        })
      );

      setUsers(usersWithOrders);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  // Use useEffect to load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Inline styles for enhanced design
  const containerStyle = {
    padding: "20px",
    backgroundColor: "#f4f7fc",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2c3e50",
    letterSpacing: "1px",
  };

  const cardStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    marginBottom: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
  };

  const cardContentStyle = {
    display: "flex",
    flexDirection: "column",
    color: "#34495e",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "5px",
  };

  const cardSubTextStyle = {
    fontSize: "14px",
    color: "#7f8c8d",
  };

  const noUserStyle = {
    textAlign: "center",
    padding: "20px",
    color: "#999",
    fontSize: "16px",
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div style={{ margin: "20px" }}>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div style={containerStyle}>
              <h1 style={headerStyle}>All Users</h1>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <div
                    key={user._id}
                    style={{
                      ...cardStyle,
                      transform: "scale(1)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <div style={cardContentStyle}>
                      <span style={cardTitleStyle}>{user.name}</span>
                      <span style={cardSubTextStyle}>{user.email}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={cardSubTextStyle}>Total Orders:</span>
                      <strong style={{ fontSize: "16px", color: "#2c3e50" }}>
                        {user.orderCount}
                      </strong>
                    </div>
                  </div>
                ))
              ) : (
                <div style={noUserStyle}>No users found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
