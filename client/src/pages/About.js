import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={'About Us'}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/about.jpeg"
            alt="About us illustration"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">ABOUT US</h1>
          <p className="text-justify mt-2">
            Welcome to our platform! We are dedicated to providing you with the
            best products and services tailored to meet your needs. Our mission
            is to ensure customer satisfaction through quality and innovation.
          </p>
          <p className="text-justify mt-2">
            With years of experience in the industry, we pride ourselves on
            building trust and fostering lasting relationships with our users.
            Join us as we continue to grow and deliver excellence.
          </p>
          <p className="text-justify mt-2">
            Thank you for choosing us, and we look forward to serving you!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
