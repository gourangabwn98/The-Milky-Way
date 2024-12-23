import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
  // const [auth] = useAuth();
  const { auth } = useAuth();
  const au = localStorage.getItem("auth");
  const authData = JSON.parse(au);
  useEffect(() => {
    // console.log("authdata", authData?.user?.name);
    if (!authData?.token) {
      // Redirect only if loading is complete and no token is found
      return <Navigate to="/login" />;
    }
  }, []);

  return (
    <Layout title={"Dashboard - The Milky Way App"}>
      <div className="container-flui m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{authData?.user?.name}</h3>
              <h3>{authData?.user?.email}</h3>
              <h3>{authData?.user?.phone}</h3>
              <h3>{authData?.user?.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
