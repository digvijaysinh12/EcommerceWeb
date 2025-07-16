import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout.js";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Dashboard - All Products"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* Sidebar Section */}
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Product List Section */}
          <div className="col-md-9">
            <h2 className="text-center mb-4">All Products</h2>

            {/* No Products Available */}
            {products.length === 0 ? (
              <div className="alert alert-warning text-center">
                No products available.
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {products.map((p) => (
                  <div className="col" key={p._id}>
                    <Link
                      to={`/dashboard/admin/product/${p.slug}`}
                      className="text-decoration-none"
                    >
                      <div className="card h-100 shadow-sm border-0 product-card">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            borderTopLeftRadius: "0.5rem",
                            borderTopRightRadius: "0.5rem",
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title text-dark">{p.name}</h5>
                          <p className="card-text text-muted" style={{ fontSize: "14px" }}>
                            {p.description.length > 90
                              ? `${p.description.slice(0, 90)}...`
                              : p.description}
                          </p>
                          <div className="mt-auto text-end">
                            <span className="badge bg-primary">View / Edit</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
