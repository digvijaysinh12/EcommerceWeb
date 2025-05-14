import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { Checkbox, Radio } from 'antd'
import { Prices } from './Prices'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify'

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoding] = useState(false);
  const { cart,setCart } = useCart();

  const navigate = useNavigate()

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoding(true)
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts(data.products)
      setLoding(false)
    } catch (error) {
      setLoding(false)
      console.log(error);
    }
  }

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);


  //get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count')
      setTotal(data?.total)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (page == 1) return;

    loadMore();
  }, [page])

  //load more 
  const loadMore = async () => {
    try {
      setLoding(true)
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
      setProducts([...products, ...data?.products])
      setLoding(false);
    } catch (error) {
      setLoding(false);
      console.log(error)
    }
  }
  // filter By Category

  const handleFilter = (value, id) => {
    let updatedChecked = [...checked];
    if (value) {
      updatedChecked.push(id);
    } else {
      updatedChecked = updatedChecked.filter((categoryId) => categoryId !== id);
    }
    setChecked(updatedChecked);
  };

  useEffect(() => {
    if (checked.length == 0 && radio.length == 0) getAllProducts();

  }, [checked.length, radio.length])

  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) filterProduct();
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      console.log('Filters:', { checked, radio });  // Log filters being applied
      const { data } = await axios.post('/api/v1/product/product-filter', { checked, radio })
      console.log('Filtered Products:', data.products);  // Log the filtered products
      setProducts(data.products);  // Update the state with filtered products
      console.log(data);
    } catch (error) {
      console.error('Error filtering products', error);
    }
  }

  return (
    <Layout title={'All Products - Best Offers'}>
      <div className='container-fluid row mt-3'>
        <div className="row">
          <div className="col-md-2">
            <h5 className='text-center'>
              Filter by Category
              <div className='d-flex flex-column'>
                {categories?.map((c) => (
                  <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                    {c.name}</Checkbox>
                ))}
              </div>
            </h5>

            {/* price filter*/}
            <h4 className='text-center'>Filter by Prices</h4>

            <div className='d-flex flex-column'>
              <Radio.Group onChange={e => setRadio(e.target.value)}>
                {Prices?.map(p => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className='d-flex flex-column'>
              <button className='btn btn-info mt-3 ' onClick={() => window.location.reload()}> RESET FILTERS</button>
            </div>

          </div>
          <div className="col-md-10 ">
            <h1 className='text-center'>
              All Products
            </h1>
            <div className='d-flex flex-wrap'>
              {products?.map((p) => (
                <div className="card m-1" style={{ width: "18rem" }} key={p._id}>
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
                        {/* Removed the button for editing */}
                        <button className="btn btn-primary ms-1" onClick={() => navigate(`/productsOne/${p.slug}`)}>More Details</button>
                      <button className="btn btn-secondary ms-1" 
                        onClick={() => {
                          setCart([...cart, p]); // ✅ Properly updating cart state
                          toast.success('Item added to cart');
                        }}>
                        Add to Cart
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='m-2 p-3'>
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
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default HomePage;
