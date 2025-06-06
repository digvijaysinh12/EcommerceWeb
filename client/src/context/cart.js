import { useState, useContext, createContext,useEffect } from "react";
// Create the Auth Context
const CartContext = createContext();

// searchProvider component to provide auth state
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if(existingCartItem) setCart(JSON.parse(existingCartItem));
  },[])
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the auth context
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
