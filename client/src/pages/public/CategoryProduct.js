import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const CategoryProduct = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) fetchProductsByCategory();
  }, [slug]);

  const fetchProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${slug}`
      );
      setProducts(data?.products || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  return (
    <Layout title={`Category - ${category?.name || "Products"}`}>
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold text-center mb-1">
          Category: {category?.name || "Loading..."}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {products?.length || 0} result(s) found
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col"
            >
              <LazyLoadImage
                src={`/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
                effect="blur"
                className="w-full h-56 object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h5 className="text-lg font-semibold mb-1">{p.name}</h5>
                <p className="text-gray-500 text-sm mb-2">
                  {p.description?.substring(0, 50)}...
                </p>
                <p className="font-bold mb-3">${p.price}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${p.slug}`)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-500 transition"
                  >
                    More Details
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-500 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
