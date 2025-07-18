import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const CategoryProduct = () => {
    const params = useParams()
    const [products,setProducts] = useState([])
    const [category,setCategory] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if(params?.slug) getProductByCat()
    },[params?.slug])

    const getProductByCat = async() =>{
        try{
            const {data} = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        }catch(error){
            console.log(error);
        }
    }

  return (
    <Layout>
        <div className='container mt-3'>
            <h4 className='text-center'>Category - {category?.name}</h4>
            <h6 className='text-center'>{products?.length} result found</h6>
            <div className='row'>
            <div className="col-md-12 ">
            <div className='d-flex flex-wrap'>
              {products?.map((p) => (
                <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
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
                      <button 
                        className='btn btn-primary ms-1'
                        onClick={() => navigate(`/product/${p.slug}`)}
                        >
                            More Details
                      </button>
                      <button className='btn btn-secondary ms-1'>
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className='m-2 p-3'>
              {products && products.length < total && (
                <button className='btn btn-warning'
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading .." : "Loadmore"}
                </button>
              )}
            </div> */}
          </div>

            </div>

        </div> 
    </Layout>
  )
}

export default CategoryProduct
