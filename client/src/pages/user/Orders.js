import React, { useEffect, useState } from 'react'
import UserMenu from '../../components/Layout/UserMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { useAuth } from '../../context/auth';

const Orders = () => {
  const [Orders,setOrders] = useState([]);
  const [auth,setAuth] = useAuth()

  const getOrders = async() => {
    try{
      const {data} = await axios.get('/api/v1/auth/orders');
      setOrders(data);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() =>{
    if(auth?.token) getOrders()
  },[auth?.token])

  return (
    <Layout>
    <div className='container-fluid m-3 p-3'>
        <div className='row'>
            <div className='col-md-3'>
                <UserMenu/>
            </div>
            <div className='col-md-9'>
                <h1>All Orders</h1>
                <p>
                  
                </p>
            </div>
        </div>
    </div>
    </Layout>
  )
}

export default Orders
