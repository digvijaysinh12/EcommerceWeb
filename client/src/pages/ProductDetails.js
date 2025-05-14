import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [realtedProducts, setRealtedProducts] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id,data?.product.category._id)
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async(pid,cid) => {
    try{
      const {data} = await axios.get(`/api/v1/product/realted-product/${pid}/${cid}`);
      setRealtedProducts(data?.product);
      console.log(data.product);
    }catch(error){
      console.log(error);
    }
  }
  return (
    <Layout>
      <div
        className="container mt-5"
        style={{
          backgroundColor: '#f8f9fa', // Light background for the page
          backgroundImage: 'url("https://via.placeholder.com/1500")', // Example background image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '50px 0',
        }}
      >
        <div className="row">
          <div className="col-md-6">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="img-fluid rounded shadow-sm"
              alt={product.name}
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-6">
            <div
              className="product-details p-4"
              style={{
                backgroundColor: '#ffffff', // White background for the product details section
                borderRadius: '8px', // Rounded corners
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Light shadow for depth
              }}
            >
              <h1 className="text-center mb-4" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
                {product.name}
              </h1>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#555' }}>
                  <strong>Description:</strong> {product.description}
                </h5>
                <h5 style={{ fontWeight: 'bold', color: '#555' }}>
                  <strong>Price:</strong> ${product.price}
                </h5>
                <h5 style={{ fontWeight: 'bold', color: '#555' }}>
                  <strong>Quantity:</strong> {product.quantity}
                </h5>
                <h5 style={{ fontWeight: 'bold', color: '#555' }}>
                  <strong>Shipping:</strong> {product.shipping ? 'Available' : 'Not Available'}
                </h5>
                <button
                  className="btn btn-danger btn-lg mt-3"
                  style={{
                    width: '100%', // Full width button
                    fontSize: '18px', // Larger text for button
                    padding: '10px 0', // More padding for the button
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <h3 className="text-center" style={{ color: '#444' }}>
            Similar Products
          </h3>
          {realtedProducts.length <0 && <p>No Similar Products Found</p>}
          {realtedProducts?.map((p) => (
                <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                  <div className="card h-100 shadow-sm " style={{ display: 'flex', flexDirection: 'column' }}>

                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      style={{
                        objectFit: 'cover',  // Ensure the image covers the area
                        height: '300px', // Set a fixed height for the image
                      }}
                    />

                    <div className="card-body " style={{ flex: 1 }}>
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text" style={{ fontSize: '13px' }}>
                        {p.description.substring(0, 30)}...
                      </p>
                      <p className="card-text" style={{ fontSize: '13px' }}>
                        $ {p.price}
                      </p>
                      <button 
                        className='btn btn-secondary ms-1'
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
