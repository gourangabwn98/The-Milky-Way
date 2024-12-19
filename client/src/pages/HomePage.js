import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import BannerSlider from "../components/slider";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // for count
  const [allUsers, setAllUsers] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      setAllCategory(data?.TotalCategory);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/auth/all-users"
      );

      setAllUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  // fatch all order
  const getTotalOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/order/all-orders");
      setAllOrders(data.TotalOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getTotalOrders();
    fetchUsers();
  }, []);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Fetch total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Filter products by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // Filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Products - Best Offers"}>
      {/* Banner */}
      {auth?.user?.role == 1 ? (
        <div
          style={{
            width: "100%",
            backgroundColor: "#F0F8FF",
            display: "flex",
            padding: 12,
            marginTop: "63px",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="row "
        >
          <div className="col-md-4 mt-0 mb-3 gx-3 gy-3">
            <div
              className="card text-center shadow"
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "20px",
              }}
            >
              {/* Display Value */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                135
              </h1>
              {/* Button */}
              <NavLink
                to="/dashboard/admin/orders"
                className="btn cat-btn"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                Today Order
              </NavLink>
            </div>
          </div>
          <div className="col-md-4 mt-0 mb-3 gx-3 gy-3">
            <div
              className="card text-center shadow"
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "20px",
              }}
            >
              {/* Display Value */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                {allOrders}
              </h1>
              {/* Button */}
              <NavLink
                to="/dashboard/admin/orders"
                className="btn cat-btn"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                All Order
              </NavLink>
            </div>
          </div>
          <div className="col-md-4 mt-0 mb-3 gx-3 gy-3">
            <div
              className="card text-center shadow"
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "20px",
              }}
            >
              {/* Display Value */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                170
              </h1>
              {/* Button */}
              <NavLink
                to="/dashboard/admin/products"
                className="btn cat-btn"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                All Products
              </NavLink>
            </div>
          </div>
          <div className="col-md-4 mt-0 mb-3 gx-3 gy-3">
            <div
              className="card text-center shadow"
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "20px",
              }}
            >
              {/* Display Value */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                {allCategory}
              </h1>
              {/* Button */}
              <NavLink
                to="/dashboard/admin/create-category"
                className="btn cat-btn"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                Create Category
              </NavLink>
            </div>
          </div>
          <div className="col-md-4 mt-0 mb-3 gx-3 gy-3">
            <div
              className="card text-center shadow"
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "20px",
              }}
            >
              {/* Display Value */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                Rs : 135
              </h1>
              {/* Button */}
              <Link
                className="btn cat-btn"
                style={{
                  backgroundColor: "#228B22",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
                to="/today-orders"
              >
                Recived Money
              </Link>
            </div>
          </div>
          <div className="col-md-4 mt-0 mb-3 gx-3 gy-3">
            <div
              className="card text-center shadow"
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "20px",
              }}
            >
              {/* Display Value */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                {allUsers.length}
              </h1>
              {/* Button */}
              <NavLink
                to="/dashboard/admin/users"
                className="btn cat-btn"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                All Customer
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <BannerSlider />
          </div>
        </>
      )}

      {/* Filters and Products */}
      <div
        className="container-fluid  row mt-4 home-page"
        // style={{ display: "flex", flexWrap: "wrap" }}
      >
        {/* Filter Section */}
        <div
          className="col-md-3 filters"
          style={{
            backgroundColor: "#F0F8FF",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
            Filter By Category
          </h4>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                style={{ marginBottom: "10px" }}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 style={{ textAlign: "center", marginTop: "20px" }}>
            Filter By Price
          </h4>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id} style={{ marginBottom: "10px" }}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
              style={{ width: "100%" }}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Product Section */}
        <div style={{ backgroundColor: "#F0F8FF" }} className="col-md-9">
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            All Products
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {products?.map((p) => (
              <div
                className="card m-2"
                key={p._id}
                style={{
                  width: "300px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src="/images/product/product.jpg"
                  className="card-img-top"
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <div className="card-body" style={{ padding: "15px" }}>
                  <h5 className="card-title" style={{ marginBottom: "10px" }}>
                    {p.name}
                  </h5>
                  <h5
                    className="card-price"
                    style={{ color: "#28a745", marginBottom: "10px" }}
                  >
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                  <p className="card-text" style={{ marginBottom: "10px" }}>
                    {p.description.substring(0, 60)}...
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/product/${p.slug}`)}
                      style={{ flex: 1, marginRight: "5px" }}
                    >
                      More Details
                    </button>
                    {auth?.user?.role != 1 && (
                      <>
                        {" "}
                        <button
                          className="btn btn-dark"
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p])
                            );
                            toast.success("Item Added to cart");
                          }}
                          style={{ flex: 1 }}
                        >
                          ADD TO CART
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products && products.length < total && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
                style={{
                  backgroundColor: "#DCDCDC",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                {loading ? "Loading ..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
