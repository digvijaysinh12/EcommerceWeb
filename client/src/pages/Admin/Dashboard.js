import React, { lazy, Suspense } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";

// Lazy load AdminMenu
const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title="Admin Dashboard">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Suspense fallback={<div className="text-center text-gray-500">Loading menu...</div>}>
              <AdminMenu />
            </Suspense>
          </div>

          {/* Admin Info */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Name:</span> {auth?.user?.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Email:</span> {auth?.user?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Contact:</span> {auth?.user?.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
