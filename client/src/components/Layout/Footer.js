import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="max-w-7xl mx-auto text-center">
        <h6 className="text-gray-700 font-medium">
          &copy; {new Date().getFullYear()} Digvijaysinh Sarvaiya. All Rights Reserved.
        </h6>
        <div className="mt-2 flex justify-center gap-4">
          <Link to="/about" className="text-indigo-600 hover:underline">About</Link>
          <Link to="/contact" className="text-indigo-600 hover:underline">Contact</Link>
          <Link to="/policy" className="text-indigo-600 hover:underline">Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
