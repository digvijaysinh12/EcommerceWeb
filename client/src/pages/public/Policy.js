import React from 'react';
import Layout from '../../components/Layout/Layout';

const Policy = () => {
  return (
    <Layout title="Policy">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <img
            src="/images/Policy.jpeg"
            alt="Policy illustration"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 w-full flex flex-col gap-4">
          <h1 className="bg-gray-800 text-white text-center text-2xl font-bold py-2 rounded">
            POLICY
          </h1>
          <p className="text-gray-700 text-justify">
            Our policies are designed to ensure a safe and transparent experience for all users. 
            Please review the terms and data handling practices outlined here to better understand our commitments.
          </p>
          <p className="text-gray-700 text-justify">
            For more details about specific policies, feel free to contact our support team or visit the relevant sections on our website.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
