import React, { useEffect, useState, lazy, Suspense } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;
// Lazy load AdminMenu
const AdminMenu = lazy(() => import("../../components/Layout/AdminMenu"));

const AdminOrders = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // Fetch all orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/auth/all-orders`);
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Update order status
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`${BASE_URL}/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="Dashboard - All Orders">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Suspense
              fallback={<div className="text-center text-gray-500">Loading menu...</div>}
            >
              <AdminMenu />
            </Suspense>
          </div>

          {/* Orders Section */}
          <div className="lg:w-3/4 space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4">All Orders</h1>

            {orders.length === 0 ? (
              <div className="text-center text-red-500 font-semibold py-10">
                No orders found
              </div>
            ) : (
              orders.map((o, i) => (
                <div key={o._id} className="bg-white shadow-md rounded-lg p-6">
                  {/* Order Info Table */}
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full text-left border border-gray-200 divide-y divide-gray-200">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="px-4 py-2">#</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Buyer</th>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Payment</th>
                          <th className="px-4 py-2">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2">{i + 1}</td>
                          <td className="px-4 py-2">
                            <Select
                              bordered={false}
                              defaultValue={o?.status}
                              onChange={(value) => handleChange(o._id, value)}
                              className="w-full"
                            >
                              {status.map((s, i) => (
                                <Option key={i} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </td>
                          <td className="px-4 py-2">{o?.buyer?.name}</td>
                          <td className="px-4 py-2">
                            {moment(o?.createdAt).fromNow()}
                          </td>
                          <td className="px-4 py-2">
                            {o?.payment?.success ? "Success" : "Failed"}
                          </td>
                          <td className="px-4 py-2">{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Products in Order */}
                  <div className="space-y-4">
                    {o?.products?.map((p) => (
                      <div
                        key={p._id}
                        className="flex flex-col sm:flex-row items-center sm:items-start border rounded-lg p-3 bg-gray-50"
                      >
                        <img
                          src={`${BASE_URL}/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="w-24 h-24 object-cover rounded mb-2 sm:mb-0 sm:mr-4"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{p.name}</p>
                          <p className="text-gray-600 text-sm">
                            {p.description.slice(0, 50)}...
                          </p>
                          <p className="text-gray-700 font-medium mt-1">Price: ${p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
