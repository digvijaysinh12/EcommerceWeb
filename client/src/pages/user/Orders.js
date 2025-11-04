import React, { useEffect, useState } from 'react';
import UserMenu from '../../components/Layout/UserMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const API = process.env.REACT_APP_API_URL;

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/api/v1/auth/orders`, {
        headers: {
          Authorization: auth?.token, // ensure token is passed if needed
        },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="All Orders">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <UserMenu />
          </div>

          <div className="lg:w-3/4">
            <h1 className="text-2xl font-bold text-center mb-6">All Orders</h1>
            <div className="space-y-6">
              {orders?.map((order, idx) => (
                <div key={order._id} className="bg-white shadow-md rounded p-4">
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full table-auto border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 border">#</th>
                          <th className="px-4 py-2 border">Status</th>
                          <th className="px-4 py-2 border">Buyer</th>
                          <th className="px-4 py-2 border">Ordered At</th>
                          <th className="px-4 py-2 border">Payment</th>
                          <th className="px-4 py-2 border">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-center">
                          <td className="px-4 py-2 border">{idx + 1}</td>
                          <td className="px-4 py-2 border">{order.status}</td>
                          <td className="px-4 py-2 border">{order.buyer?.name}</td>
                          <td className="px-4 py-2 border">{moment(order.createdAt).fromNow()}</td>
                          <td className="px-4 py-2 border">{order.payment.success ? "Success" : "Failed"}</td>
                          <td className="px-4 py-2 border">{order.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.products?.map((p) => (
                      <div key={p._id} className="flex bg-gray-50 p-3 rounded shadow-sm">
                        <img
                          src={`${API}/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="w-24 h-24 object-cover rounded mr-4"
                        />
                        <div>
                          <h4 className="font-semibold">{p.name}</h4>
                          <p className="text-gray-500 text-sm">{p.description.substring(0, 30)}...</p>
                          <p className="text-gray-700 font-medium">Price: ₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
