import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <>
    <div className='footer'>
      <h6 className='text-center'>All Right Reserved &copy; Digvijayinh Sarvaiya </h6>
      <p className='text-center mt-3'>
        <Link to='/about'>ABOUT</Link>
        <Link to='/contact'>CONTACT</Link>
        <Link to='/policy'>POLICY</Link>
      </p>
      </div>
    </>
  )
}

export default Footer
