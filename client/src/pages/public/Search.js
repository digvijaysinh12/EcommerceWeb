import Layout from '../../components/Layout/Layout'
import React, { useState } from 'react'
import { useSearch } from '../../context/search';
import { Link } from 'react-scroll';

const Search = () => {

    const[values,setValues] = useSearch();

  return (
    <Layout title={'Search results'}>
        <div className='container'>
            <div className='text-center'>
                <h1>Search Results</h1>
                <h6>{values?.result.length<1 ? 'Product Not Found' : `Found ${values?.result.length}`}</h6>
                <div className='d-flex flex-wrap mt-4'>
              {values?.result?.map((p) => (
                <div className="card m-1" style={{ width: "18rem" }} key={p._id}>
                  <Link to={`/dashboard/admin/product/${p.slug}`} className="text-decoration-none">
                    <div className="card h-100 shadow-sm" style={{ display: 'flex', flexDirection: 'column' }}>

                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        style={{
                          objectFit: 'cover',  // Ensure the image covers the area
                          height: '300px', // Set a fixed height for the image
                        }}
                      />

                      <div className="card-body" style={{ flex: 1 }}>
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text" style={{ fontSize: '13px' }}>
                          {p.description.substring(0, 30)}...
                        </p>
                        <p className="card-text" style={{ fontSize: '13px' }}>
                          $ {p.price}
                        </p>
                        <div className="d-flex justify-content-between">
                          <button className="btn btn-primary ms-1">More Details</button>
                          <button className="btn btn-secondary ms-1">Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            </div>
        </div>
      
    </Layout>
  )
}

export default Search
