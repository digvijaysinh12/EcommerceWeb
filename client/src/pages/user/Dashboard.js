import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <UserMenu />
          </div>

          {/* User Info */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow-md rounded p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{auth?.user?.name}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Email:</span> {auth?.user?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Address:</span> {auth?.user?.address || 'No address added'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
