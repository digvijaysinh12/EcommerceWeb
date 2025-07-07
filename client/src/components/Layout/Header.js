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
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f8f9fa",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      {/* Brand */}
      <NavLink
        to="/"
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "#333",
          textDecoration: "none",
          marginRight: "auto",
        }}
      >
        🛒 ECOMMERCE APP
      </NavLink>

      {/* Search */}
      <div style={{ flexGrow: 1, minWidth: "200px" }}>
        <Search />
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "#007bff" : "#555",
            textDecoration: "none",
            fontWeight: isActive ? "600" : "400",
          })}
        >
          HOME
        </NavLink>

        {/* Simple category dropdown */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              userSelect: "none",
            }}
            onClick={() => {
              const menu = document.getElementById("category-menu");
              if (menu.style.display === "block") {
                menu.style.display = "none";
              } else {
                menu.style.display = "block";
              }
            }}
          >
            CATEGORY ▼
          </span>
          <div
            id="category-menu"
            style={{
              position: "absolute",
              top: "25px",
              left: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "10px",
              display: "none",
              zIndex: 100,
              minWidth: "150px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onMouseLeave={() => {
              document.getElementById("category-menu").style.display = "none";
            }}
          >
            <NavLink
              to="/categories"
              style={{ display: "block", padding: "5px 0", color: "#333", textDecoration: "none" }}
              onClick={() => (document.getElementById("category-menu").style.display = "none")}
            >
              All Categories
            </NavLink>
            {categories.map((c) => (
              <NavLink
                key={c.id}
                to={"/category/" + c.slug}
                style={{ display: "block", padding: "5px 0", color: "#333", textDecoration: "none" }}
                onClick={() => (document.getElementById("category-menu").style.display = "none")}
              >
                {c.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Auth Links */}
        {auth.user === null || auth.user === undefined ? (
          <>
            <NavLink
              to="/register"
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#555",
                textDecoration: "none",
              })}
            >
              REGISTER
            </NavLink>
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#555",
                textDecoration: "none",
              })}
            >
              LOGIN
            </NavLink>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <span
              style={{ cursor: "pointer", color: "#555", fontWeight: "500" }}
              onClick={() => {
                const menu = document.getElementById("user-menu");
                if (menu.style.display === "block") {
                  menu.style.display = "none";
                } else {
                  menu.style.display = "block";
                }
              }}
            >
              {auth.user.name} ▼
            </span>
            <div
              id="user-menu"
              style={{
                position: "absolute",
                top: "25px",
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                padding: "10px",
                display: "none",
                zIndex: 100,
                minWidth: "120px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onMouseLeave={() => {
                document.getElementById("user-menu").style.display = "none";
              }}
            >
              <NavLink
                to={auth.user.role === 1 ? "/dashboard/admin" : "/dashboard/user"}
                style={{ display: "block", padding: "5px 0", color: "#333", textDecoration: "none" }}
                onClick={() => (document.getElementById("user-menu").style.display = "none")}
              >
                DASHBOARD
              </NavLink>
              <span
                style={{ display: "block", padding: "5px 0", cursor: "pointer", color: "#333" }}
                onClick={handleLogout}
              >
                LOGOUT
              </span>
            </div>
          </div>
        )}

        {/* Cart */}
        <NavLink
          to="/cart"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          CART ({cart.length})
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
