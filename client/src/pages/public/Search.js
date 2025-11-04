import React from "react";
import Layout from "../../components/Layout/Layout";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Search = () => {
  const [values] = useSearch();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  return (
    <Layout title="Search Results">
      <div className="container mx-auto px-4 mt-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Results</h1>
          <h6 className="text-gray-600">
            {values?.result?.length < 1
              ? "Product Not Found"
              : `Found ${values?.result?.length} products`}
          </h6>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {values?.result?.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <LazyLoadImage
                src={`${BASE_URL}/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
                effect="blur"
                className="w-full h-64 object-cover"
              />

              <div className="p-4 flex flex-col flex-1">
                <h5 className="font-semibold">{p.name}</h5>
                <p className="text-gray-500 text-sm mt-1">
                  {p.description.substring(0, 60)}...
                </p>
                <p className="text-blue-600 font-bold mt-2">${p.price}</p>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/productsOne/${p.slug}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition w-full"
                  >
                    More Details
                  </button>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition w-full">
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

export default Search;
