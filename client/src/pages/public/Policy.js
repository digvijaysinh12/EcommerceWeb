import React from 'react';
import Layout from '../../components/Layout/Layout';

const Policy = () => {
  return (
    <Layout title={'Policy'}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="../images/Policy.jpeg"
            alt="Policy illustration"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">POLICY</h1>
          <p className="text-justify mt-2">
            Our policies are designed to ensure a safe and transparent experience for all users. 
            Please review the terms and data handling practices outlined here to better understand our commitments.
          </p>
          <p className="mt-3">
            For more details about specific policies, feel free to contact our support team or visit the relevant sections on our website.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
