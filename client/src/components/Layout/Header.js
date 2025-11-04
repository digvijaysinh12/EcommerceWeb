import React, { useState, lazy, Suspense } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import useCategory from "../../hooks/useCategory";
import { toast } from "react-toastify";
import { HiMenu, HiX, HiShoppingCart } from "react-icons/hi";
import "./Header.css"

const Search = lazy(() => import("../Form/Search"));

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/login", { replace: true });
    setMenuOpen(false);
  };

  const renderCategories = () =>
    categories?.map((c) => (
      <NavLink
        key={c._id}
        to={`/category/${c.slug}`}
        className="dropdown-link"
        onClick={() => setMenuOpen(false)}
      >
        {c.name}
      </NavLink>
    ));

  return (
    <header className="header">
      <div className="header-container">
        {/* Brand */}
        <NavLink to="/" className="brand">
          🛍️ShopEasy
        </NavLink>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <div className="search-box">
            <Suspense fallback={<div>Loading...</div>}>
              <Search />
            </Suspense>
          </div>

          <div className="nav-links">
            <NavLink to="/" className="nav-item">
              Home
            </NavLink>

            <div className="dropdown">
              <button className="dropdown-btn">Categories ▾</button>
              <div className="dropdown-content">
                <NavLink to="/categories" className="dropdown-link">
                  All Categories
                </NavLink>
                {renderCategories()}
              </div>
            </div>

            {!auth?.user ? (
              <>
                <NavLink to="/register" className="nav-item">
                  Register
                </NavLink>
                <NavLink to="/login" className="nav-item">
                  Login
                </NavLink>
              </>
            ) : (
              <div className="dropdown">
                <button className="dropdown-btn">{auth.user.name} ▾</button>
                <div className="dropdown-content right">
                  <NavLink
                    to={auth.user.role === 1 ? "/dashboard/admin" : "/dashboard/user"}
                    className="dropdown-link"
                  >
                    Dashboard
                  </NavLink>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}

            <NavLink to="/cart" className="cart-btn">
              <HiShoppingCart size={20} />
              {cart?.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </NavLink>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle">
          <button className="toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav">
            <Suspense fallback={<div>Loading...</div>}>
              <Search />
            </Suspense>

            <NavLink
              to="/"
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <span className="mobile-heading">Categories</span>
            <NavLink
              to="/categories"
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              All Categories
            </NavLink>
            {renderCategories()}

            {!auth?.user ? (
              <>
                <NavLink
                  to="/register"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={auth.user.role === 1 ? "/dashboard/admin" : "/dashboard/user"}
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}

            <NavLink
              to="/cart"
              className="mobile-link mobile-cart"
              onClick={() => setMenuOpen(false)}
            >
              <HiShoppingCart size={20} />
              <span className="ml-2">Cart</span>
              {cart?.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
