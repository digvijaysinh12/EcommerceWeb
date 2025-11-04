import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Total price calculation
  const totalPrice = () => {
    return cart?.reduce((total, item) => total + item.price, 0)
      .toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    const updatedCart = cart.filter(item => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Get Braintree token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error("Braintree token error:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle Payment
  const handlePayment = async () => {
    if (!instance) return;
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post("/api/v1/product/braintree/payment", { nonce, cart });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Payment Failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          {`Hello ${auth?.token && auth?.user?.name}`}
        </h1>
        <h4 className="text-center mb-6">
          {cart?.length
            ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout"}`
            : "Your Cart is Empty"}
        </h4>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart?.map((p) => (
              <div key={p._id} className="flex flex-col sm:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                <LazyLoadImage
                  src={`/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                  effect="blur"
                  className="w-full sm:w-32 h-32 object-cover"
                />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold">{p.name}</h5>
                    <p className="text-gray-500 text-sm mt-1">{p.description.slice(0, 60)}...</p>
                    <p className="text-blue-600 font-bold mt-2">${p.price}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => removeCartItem(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Payment */}
          <div className="lg:w-1/3 bg-white shadow-md rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center">Cart Summary</h2>
            <p className="text-gray-500 mb-2 text-center">Total | Checkout | Payment</p>
            <hr className="mb-4" />
            <h3 className="text-lg font-semibold mb-4 text-center">Total: {totalPrice()}</h3>

            {auth?.user?.address ? (
              <div className="mb-4 text-center">
                <h4 className="font-semibold mb-1">Current Address</h4>
                <p className="text-gray-600">{auth.user.address}</p>
                <button
                  onClick={() => navigate("/dashboard/user/profile")}
                  className="mt-2 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-4 text-center">
                <button
                  onClick={() =>
                    auth?.token ? navigate("/dashboard/user/profile") : navigate("/login", { state: "/cart" })
                  }
                  className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                >
                  {auth?.token ? "Update Address" : "Login to Checkout"}
                </button>
              </div>
            )}

            {clientToken && cart?.length > 0 && auth?.user?.address && (
              <>
                <DropIn
                  options={{ authorization: clientToken, paypal: { flow: "vault" } }}
                  onInstance={(inst) => setInstance(inst)}
                />
                <button
                  onClick={handlePayment}
                  disabled={loading || !instance}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
