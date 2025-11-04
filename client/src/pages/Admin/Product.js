import React, { useState, useEffect, lazy, Suspense } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Lazy load AdminMenu
const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const Product = () => {
  const [products, setProducts] = useState([]);

  // ✅ Base URL from .env
  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="Dashboard - All Products">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Suspense fallback={<div className="text-center text-gray-500">Loading menu...</div>}>
              <AdminMenu />
            </Suspense>
          </div>

          {/* Products List */}
          <div className="lg:w-3/4">
            <h2 className="text-2xl font-bold text-center mb-6">All Products</h2>

            {products.length === 0 ? (
              <div className="text-center p-6 bg-yellow-100 rounded-lg shadow">
                <p className="text-yellow-800 font-medium">No products available.</p>
                <Link
                  to="/dashboard/admin/create-product"
                  className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  ➕ Add New Product
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="block rounded-lg shadow-md hover:shadow-lg transition overflow-hidden bg-white"
                  >
                    <LazyLoadImage
                      src={`${BASE_URL}/api/v1/product/product-photo/${p._id}`}
                      effect="blur"
                      alt={p.name}
                      height={200}
                      width="100%"
                      className="object-cover w-full"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="p-4 flex flex-col h-full">
                      <h5 className="text-lg font-semibold text-gray-800 mb-2">{p.name}</h5>
                      <p className="text-gray-600 text-sm flex-1">
                        {p.description.length > 90
                          ? `${p.description.slice(0, 90)}...`
                          : p.description}
                      </p>
                      <div className="mt-4 text-right">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">
                          View / Edit
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
