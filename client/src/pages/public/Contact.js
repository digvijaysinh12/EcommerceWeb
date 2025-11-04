import React from "react";
import Layout from "../../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout title="Contact Us">
      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Image Section */}
        <div className="md:w-1/2">
          <img
            src="/images/contactus.jpeg"
            alt="Contact us illustration"
            className="w-full rounded shadow"
          />
        </div>

        {/* Contact Info Section */}
        <div className="md:w-1/2 bg-white shadow rounded p-6 flex flex-col gap-4">
          <h1 className="bg-gray-800 text-white text-center p-3 text-2xl font-bold rounded">
            Contact Us
          </h1>
          <p className="text-gray-700 mt-2">
            For any queries or information about our products, feel free to contact us anytime. We are available 24x7 to assist you.
          </p>

          <div className="flex items-center gap-3 mt-3 text-gray-700 text-lg">
            <BiMailSend className="text-blue-600" />
            <span>help@ecommerceapp.com</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-lg">
            <BiPhoneCall className="text-green-600" />
            <span>012-3456789</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-lg">
            <BiSupport className="text-yellow-600" />
            <span>1800-0000-0000 (Toll Free)</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
