import React from "react";
import Layout from "../../components/Layout/Layout";

const About = () => {
  return (
    <Layout title="About Us">
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Image Section */}
        <div className="md:w-1/2">
          <img
            src="/images/about.jpeg"
            alt="About us illustration"
            className="w-full rounded shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="bg-gray-800 text-white text-center p-3 text-2xl font-bold rounded">
            ABOUT US
          </h1>
          <p>
            Welcome to our platform! We are dedicated to providing you with the
            best products and services tailored to meet your needs. Our mission
            is to ensure customer satisfaction through quality and innovation.
          </p>
          <p>
            With years of experience in the industry, we pride ourselves on
            building trust and fostering lasting relationships with our users.
            Join us as we continue to grow and deliver excellence.
          </p>
          <p>
            Thank you for choosing us, and we look forward to serving you!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
