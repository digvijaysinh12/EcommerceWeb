import React, { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Lazy load Layout and AdminMenu
const Layout = lazy(() => import("../../components/Layout/Layout"));
const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const Users = () => {
  const [users, setUsers] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL; // ✅ from .env

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/auth/all-users`);
      setUsers(data.users || []);
    } catch (error) {
      console.log("❌ Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">Loading...</div>}>
      <Layout title="Dashboard - Users">
        <div className="container mx-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Suspense fallback={<div className="text-center text-gray-500">Loading menu...</div>}>
                <AdminMenu />
              </Suspense>
            </div>

            {/* Users Table */}
            <div className="lg:w-3/4 bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">All Users</h1>

              {users.length === 0 ? (
                <div className="text-center text-red-500 font-semibold py-10">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase">#</th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm">{index + 1}</td>
                          <td className="px-6 py-4 text-sm">{user.name}</td>
                          <td className="px-6 py-4 text-sm">{user.email}</td>
                          <td className="px-6 py-4 text-sm">{user.phone || "-"}</td>
                          <td className="px-6 py-4 text-sm">
                            {user.role === 1 ? "Admin" : "User"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
};

export default Users;
