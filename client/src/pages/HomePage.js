import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "./Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) filterProduct();
    else getAllProducts();
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts([...products, ...data?.products]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    value ? all.push(id) : all = all.filter((c) => c !== id);
    setChecked(all);
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filter", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="All Products - Best Offers">
      <div className="container-fluid px-4">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold text-center">Filter by Category</h5>
<div className="filter-box">
  {categories?.map((c) => {
    const isChecked = checked.includes(c._id);
    return (
      <div 
        key={c._id} 
        style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}
      >
        <input
          type="checkbox"
          id={`checkbox-${c._id}`}
          checked={isChecked}
          onChange={(e) => handleFilter(e.target.checked, c._id)}
        />
        <label htmlFor={`checkbox-${c._id}`}>{c.name}</label>
      </div>
    );
  })}
</div>

            <h5 className="fw-bold text-center mt-4">Filter by Prices</h5>
            <Radio.Group
              onChange={(e) => setRadio(e.target.value)}
              className="filter-box"
            >
              {Prices?.map((p, i) => (
                <Radio key={i} value={p.array}>
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>
            <div className="d-grid mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setChecked([]);
                  setRadio([]);
                  getAllProducts();
                }}
              >
                RESET FILTERS
              </button>
            </div>
          </div>

          {/* Products Display */}
          <div className="col-md-9">
            <h2 className="text-center mb-4 fw-bold">All Products</h2>
            <div className="row g-4">
              {products?.map((p) => (
                <div key={p._id} className="col-sm-6 col-lg-4">
                  <div className="card product-card h-100 shadow-sm">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="card-img-top product-img"
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">
                        {p.description.substring(0, 60)}...
                      </p>
                      <p className="fw-bold mb-2">${p.price}</p>
                      <div className="mt-auto d-flex justify-content-between gap-2">
                        <button
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => navigate(`/productsOne/${p.slug}`)}
                        >
                          More Details
                        </button>
                        <button
                          className="btn btn-secondary btn-sm w-100"
                          onClick={() => {
                            if (!cart.some((item) => item._id === p._id)) {
                              const updated = [...cart, p];
                              setCart(updated);
                              localStorage.setItem("cart", JSON.stringify(updated));
                              toast.success("Item added to cart");
                            } else {
                              toast.info("Item already in cart");
                            }
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center my-4">
              {products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={() => setPage(page + 1)}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
