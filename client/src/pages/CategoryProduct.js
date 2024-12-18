import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd"; // Importing Ant Design components
import "../styles/CategoryProductStyles.css";
import axios from "axios";
import BannerSlider from "../components/slider";

const Prices = [
  { _id: 0, name: "Any", array: [] },
  { _id: 1, name: "0 to $50", array: [0, 50] },
  { _id: 2, name: "$51 to $100", array: [51, 100] },
  { _id: 3, name: "$101 to $200", array: [101, 200] },
  { _id: 4, name: "Above $200", array: [201, Infinity] },
];

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [radio, setRadio] = useState([]);

  // Fetch all categories
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-categories");
      setCategories(data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch products by category
  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setFilteredProducts(data?.products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  // Handle category filter
  const handleFilter = (checked, categoryId) => {
    const updatedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(updatedCategories);

    const filtered = products.filter((product) =>
      updatedCategories.length
        ? updatedCategories.includes(product.category)
        : true
    );
    setFilteredProducts(filtered);
  };

  // Handle price filter
  useEffect(() => {
    const filterByPrice = () => {
      const [min, max] = radio.length ? radio : [0, Infinity];
      const filtered = products.filter(
        (product) => product.price >= min && product.price <= max
      );
      setFilteredProducts(filtered);
    };

    filterByPrice();
  }, [radio, products]);

  // Fetch categories and products on component mount
  useEffect(() => {
    getCategories();
    if (params?.slug) getProductsByCategory();
  }, [params?.slug]);

  return (
    <Layout>
      {/* Banner Section */}
      <div style={{ marginBottom: "20px" }}>
        <BannerSlider />
      </div>

      <div className="container mt-3 category">
        <h4 className="text-center">
          Category - <span className="text-primary">{params.slug}</span>
        </h4>
        <h6 className="text-center">
          {filteredProducts?.length} result(s) found
        </h6>

        <div className="row col-md-14 ">
          {/* Filter Section */}
          <div
            className="col-md-3 filters"
            style={{
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

          {/* Products List */}
          <div className="col-md-9">
            <div className="d-flex flex-wrap">
              {filteredProducts?.map((product) => (
                <div className="card m-2" key={product._id}>
                  <img
                    src="/images/product/product.jpg"
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <h5 className="card-title text-success">
                      {product.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                    <p className="card-text">
                      {product.description.substring(0, 60)}...
                    </p>
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
