import React from "react";
import Layout from "../../components/Layout/Layout";
import useCategory from "../../hooks/useCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title="All Categories">
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <h2 className="text-3xl font-bold text-center mb-8">All Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((c) => (
            <Link
              key={c._id}
              to={`/category/${c.slug}`}
              className="bg-blue-600 text-white text-center py-4 px-6 rounded-lg shadow hover:bg-blue-500 transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
