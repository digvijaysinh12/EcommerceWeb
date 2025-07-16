import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import Search from "../Form/Search";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <NavLink className="navbar-brand fw-bold text-primary" to="/">
          🛒 E-Shop
        </NavLink>

        {/* Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search */}
          <div className="mx-auto my-2 my-lg-0 w-100 w-lg-50 px-lg-3">
            <Search />
          </div>

          {/* Right side links */}
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </span>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/categories">
                    All Categories
                  </NavLink>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <NavLink className="dropdown-item" to={`/category/${c.slug}`}>
                      {c.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>

            {/* Auth Links */}
            {!auth.user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth.user.name}
                </span>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to={auth.user.role === 1 ? "/dashboard/admin" : "/dashboard/user"}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <span
                      className="dropdown-item"
                      role="button"
                      onClick={handleLogout}
                    >
                      Logout
                    </span>
                  </li>
                </ul>
              </li>
            )}

            {/* Cart */}
            <li className="nav-item">
              <NavLink className="btn btn-outline-primary position-relative" to="/cart">
                Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
