import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { Radio, Skeleton } from "antd";
import { Prices } from "./Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch categories, total, and first page products
  useEffect(() => {
    fetchCategories();
    fetchTotalProducts();
    fetchProducts(1);
  }, []);

  // Handle filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (checkedCategories.length || selectedPrice) {
        fetchFilteredProducts();
      } else {
        fetchProducts(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [checkedCategories, selectedPrice]);

  // Handle pagination
  useEffect(() => {
    if (page > 1) loadMoreProducts(page);
  }, [page]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/category/get-category`);
      if (data?.success) setCategories(data.category);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  // Fetch total product count
  const fetchTotalProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/product-count`);
      setTotalProducts(data.total);
    } catch {
      toast.error("Failed to fetch product count");
    }
  };

  // Fetch products
  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/product-list/${pageNum}`);
      setProducts(data.products);
      setLoading(false);
    } catch {
      setLoading(false);
      toast.error("Failed to load products");
    }
  };

  // Load more
  const loadMoreProducts = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/product-list/${pageNum}`);
      setProducts((prev) => [...prev, ...data.products]);
      setLoading(false);
    } catch {
      setLoading(false);
      toast.error("Failed to load more products");
    }
  };

  // Filter products
  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/v1/product/product-filter`, {
        checked: checkedCategories,
        radio: selectedPrice,
      });
      setProducts(data.products);
      setLoading(false);
    } catch {
      setLoading(false);
      toast.error("Failed to apply filters");
    }
  };

  // Category toggle
  const toggleCategory = (checked, categoryId) => {
    if (checked) {
      setCheckedCategories((prev) => [...prev, categoryId]);
    } else {
      setCheckedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setCheckedCategories([]);
    setSelectedPrice(null);
    fetchProducts(1);
  };

  // Add to cart
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
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="md:w-1/4 w-full">
          {/* Toggle Button for Mobile */}
          <div className="md:hidden mb-4">
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filter Section */}
          <div
            className={`bg-white p-4 shadow rounded space-y-6 transition-all duration-300 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            {/* Categories */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Categories</h2>
              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedCategories.includes(c._id)}
                      onChange={(e) => toggleCategory(e.target.checked, c._id)}
                      className="h-4 w-4 text-blue-600 accent-blue-600"
                    />
                    <span className="text-gray-700 text-sm md:text-base">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Price</h2>
              <Radio.Group
                onChange={(e) => setSelectedPrice(e.target.value)}
                value={selectedPrice}
                className="flex flex-col gap-2"
              >
                {Prices.map((p, i) => (
                  <Radio key={i} value={p.array} className="text-gray-700 text-sm md:text-base">
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>

            <button
              onClick={resetFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Products Section */}
        <section className="md:w-3/4 w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-center md:text-left">All Products</h2>

          {/* Skeleton loader */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} active paragraph={{ rows: 4 }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white shadow rounded overflow-hidden flex flex-col hover:shadow-lg transition"
                >
                  <LazyLoadImage
                    src={`${BASE_URL}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    effect="blur"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm sm:text-lg">{p.name}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      {p.showFull
                        ? p.description
                        : p.description.length > 80
                        ? `${p.description.substring(0, 80)}...`
                        : p.description}
                    </p>

                    {p.description.length > 80 && (
                      <button
                        className="text-blue-600 text-xs mt-1 hover:underline"
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((item) =>
                              item._id === p._id ? { ...item, showFull: !item.showFull } : item
                            )
                          )
                        }
                      >
                        {p.showFull ? "Show Less" : "Show More"}
                      </button>
                    )}

                    <p className="font-bold mt-2 text-sm sm:text-base">₹{p.price}</p>

                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => navigate(`/productsOne/${p.slug}`)}
                        className="flex-1 bg-blue-600 text-white text-xs sm:text-sm py-1 rounded hover:bg-blue-500 transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="flex-1 bg-gray-200 text-gray-800 text-xs sm:text-sm py-1 rounded hover:bg-gray-300 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {products.length < totalProducts && (
            <div className="text-center mt-4">
              <button
                onClick={() => setPage(page + 1)}
                disabled={loading}
                className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400 transition text-sm sm:text-base"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Home;
