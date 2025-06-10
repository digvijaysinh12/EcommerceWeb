import React from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      const index = myCart.findIndex((item) => item._id === pid);
      if (index !== -1) {
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem('cart', JSON.stringify(myCart));
        toast.success('Item removed from cart');
      }
    } catch (error) {
      toast.error('Something went wrong while removing item');
    }
  };

  // Calculate total
  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  };

  return (
    <Layout title={'Your Cart - Shop Now'}>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-12">
            <h3 className="text-center p-2 bg-light">
              {auth?.token ? `Hello, ${auth?.user?.name}` : 'Welcome to Cart'}
            </h3>
            <h5 className="text-center text-muted">
              {cart?.length > 0
                ? `You have ${cart.length} item(s) in your cart`
                : 'Your cart is empty'}
            </h5>
          </div>
        </div>

        <div className="row mt-3">
          {/* Cart items */}
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="card mb-3" key={p._id}>
                <div className="row g-0 align-items-center">
                  <div className="col-md-4 text-center">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="img-fluid rounded-start"
                      style={{ maxHeight: '150px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description?.substring(0, 50)}...</p>
                      <p className="card-text text-primary fw-bold">Price: ₹{p.price}</p>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeCartItem(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Sidebar */}
          <div className="col-md-4">
            <div className="card p-3">
              <h4>Cart Summary</h4>
              <hr />
              <p>Total Items: {cart.length}</p>
              <p>Total Amount: ₹{getTotal()}</p>

              {auth?.token ? (
                <button
                  className="btn btn-success"
                  onClick={() => toast.info("Implement payment functionality")}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <button
                  className="btn btn-warning"
                  onClick={() => navigate('/login')}
                >
                  Login to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
