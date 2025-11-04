 import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Page Not Found">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Oops! Page Not Found</h2>
        <p className="text-gray-700 mb-6 text-center">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-500 transition"
        >
          Go Back Home
        </button>
      </div>
    </Layout>
  );
};

export default NotFound;
