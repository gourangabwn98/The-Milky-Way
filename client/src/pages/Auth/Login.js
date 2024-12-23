import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import "./Modal.css";
import { useAuth } from "../../context/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log("auth", auth);
    if (auth?.token) {
      navigate("/");
    }
  }, []);
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setModalVisible(true);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));

        setTimeout(() => {
          setModalVisible(false);
          navigate(location.state || "/");
        }, 3000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container " style={{ minHeight: "80vh" }}>
        <form
          style={{
            minHeight: "60vh",
            minWidth: "30vw",
            padding: 40,
            borderRadius: 10,
          }}
          onSubmit={handleSubmit}
        >
          <h4 className="title">LOGIN </h4>

          <div className="mb-4">
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="btn forgot-btn w-100"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            LOGIN
          </button>
        </form>
      </div>
      {/* Modal for 3 seconds */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Login;
