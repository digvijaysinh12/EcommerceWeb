import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Radio } from "antd";
import { Prices } from "./Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Fetch categories, total product count, and first page products on mount
  useEffect(() => {
    fetchCategories();
    fetchTotalProducts();
    fetchProducts(page);
  }, []);

  // Fetch filtered products when filters change
  useEffect(() => {
    if (checkedCategories.length || selectedPrice.length) {
      fetchFilteredProducts();
    } else {
      fetchProducts(1);
    }
  }, [checkedCategories, selectedPrice]);

  // Load more products when page changes (except page 1)
  useEffect(() => {
    if (page > 1) loadMoreProducts(page);
  }, [page]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data.category);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Fetch total product count
  const fetchTotalProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotalProducts(data.total);
    } catch (error) {
      console.error("Failed to fetch total products:", error);
    }
  };

  // Fetch products for a specific page
  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${pageNum}`);
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch products:", error);
    }
  };

  // Load more products for pagination
  const loadMoreProducts = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${pageNum}`);
      setProducts((prev) => [...prev, ...data.products]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to load more products:", error);
    }
  };

  // Fetch products filtered by categories and price range
  const fetchFilteredProducts = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filter", {
        checked: checkedCategories,
        radio: selectedPrice,
      });
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
    }
  };

  // Handle category checkbox toggle
  const toggleCategory = (checked, categoryId) => {
    if (checked) {
      setCheckedCategories((prev) => [...prev, categoryId]);
    } else {
      setCheckedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  // Reset filters and reload all products
  const resetFilters = () => {
    setCheckedCategories([]);
    setSelectedPrice([]);
    fetchProducts(1);
  };

  // Add product to cart (avoid duplicates)
  const addToCart = (product) => {
    const exists = cart.some((item) => item._id === product._id);
    if (!exists) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item added to cart");
    } else {
      toast.info("Item already in cart");
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
              {categories.map((c) => (
                <div
                  key={c._id}
                  style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    type="checkbox"
                    id={`category-${c._id}`}
                    checked={checkedCategories.includes(c._id)}
                    onChange={(e) => toggleCategory(e.target.checked, c._id)}
                  />
                  <label htmlFor={`category-${c._id}`}>{c.name}</label>
                </div>
              ))}
            </div>

            <h5 className="fw-bold text-center mt-4">Filter by Prices</h5>
            <Radio.Group
              onChange={(e) => setSelectedPrice(e.target.value)}
              value={selectedPrice}
              className="filter-box"
            >
              {Prices.map((p, i) => (
                <Radio key={i} value={p.array}>
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>

            <div className="d-grid mt-3">
              <button className="btn btn-outline-secondary" onClick={resetFilters}>
                RESET FILTERS
              </button>
            </div>
          </div>

          {/* Products Display */}
          <div className="col-md-9">
            <h2 className="text-center mb-4 fw-bold">All Products</h2>

            <div className="row g-4">
              {products.map((p) => (
                <div key={p._id} className="col-sm-6 col-lg-4">
                  <div className="card product-card h-100 shadow-sm">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="card-img-top product-img"
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">{p.description.substring(0, 60)}...</p>
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
                          onClick={() => addToCart(p)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {products.length < totalProducts && (
              <div className="text-center my-4">
                <button
                  className="btn btn-warning"
                  onClick={() => setPage(page + 1)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
