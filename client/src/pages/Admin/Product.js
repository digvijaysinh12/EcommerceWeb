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
      const { data } = await axios.get('/api/v1/product/get-product');
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Dashboard - All Products"}>
      <div className='container mt-3'>
        <div className='row'>
          {/* Sidebar Section */}
          <div className='col-md-3'>
            <AdminMenu />
          </div>

          {/* Product Display Section */}
          <div className='col-md-9'>
            <h1 className='text-center mb-4'>All Products List</h1>

            {/* Empty state handling */}
            {products.length === 0 ? (
              <div className='alert alert-info text-center'>No products available.</div>
            ) : (
              <div className='d-flex flex-wrap'>
                {products?.map((p) => (
                  <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className="product-link text-decoration-none ">
                    <div className="card m-3" style={{ width: '15rem' }}>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}

                      />
                      <div className="card-body">
                        <h6 className="card-title">{p.name}</h6>
                        <p className="card-text" style={{ fontSize: "13px" }}>
                          {p.description.length > 100 ? `${p.description.slice(0, 100)}...` : p.description}
                        </p>
                      </div>
                    </div>
                  </Link>
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
