import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (params?.slug) fetchProduct();
  }, [params?.slug]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      fetchRelatedProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/product/realted-product/${pid}/${cid}`);
      setRelatedProducts(data?.product || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={product.name || "Product Details"}>
      <div className="container mx-auto px-4 py-8">
        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 flex justify-center">
            <LazyLoadImage
              src={`${BASE_URL}/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              effect="blur"
              className="rounded shadow-md object-contain h-96 w-full"
            />
          </div>

          <div className="lg:w-1/2 bg-white p-6 rounded shadow-md flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-bold text-xl">${product.price}</p>
            <p className="text-gray-700">
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p className="text-gray-700">
              <strong>Shipping:</strong> {product.shipping ? "Available" : "Not Available"}
            </p>
            <button
              className="bg-red-600 text-white py-3 rounded mt-4 hover:bg-red-700 transition w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Similar Products</h2>
          {relatedProducts.length === 0 ? (
            <p className="text-center text-gray-500">No Similar Products Found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p._id} className="bg-white shadow-md rounded flex flex-col overflow-hidden">
                  <LazyLoadImage
                    src={`${BASE_URL}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    effect="blur"
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h5 className="font-semibold">{p.name}</h5>
                    <p className="text-gray-500 text-sm mt-1">{p.description?.substring(0, 60)}...</p>
                    <p className="text-blue-600 font-bold mt-2">${p.price}</p>
                    <button
                      className="mt-auto bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
