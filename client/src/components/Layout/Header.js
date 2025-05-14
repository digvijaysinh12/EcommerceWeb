import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth'; // Ensure this import is correct
import { toast } from 'react-toastify';
import Search from '../Form/Search';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const navigate = useNavigate();

  // Handle logout action
  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
    // Show success toast and then navigate after a slight delay
    toast.success("Logout Successfully", {
      onClose: () => {
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after toast
        }, 3000); // 3-second delay before redirect
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink to="/" className="navbar-brand">🛒 ECOMMERCE APP</NavLink>

      {/* Hamburger Toggle Button for mobile */}
      <NavLink className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </NavLink>

      {/* Navbar links (collapsible) */}
      <div className="collapse navbar-collapse " id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <Search />
          <li className="nav-item">
            <NavLink to="/" className="nav-link ">HOME</NavLink>
          </li>

          {/* Category Dropdown */}
          <li className="nav-item">
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                CATEGORY
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                    <NavLink className="dropdown-item" to={'/categories'}>
                      All Categories
                    </NavLink>
                    </li>
                {categories.map(c => (
                  <li key={c.id}>

                    <NavLink className="dropdown-item" to={`/category/${c.slug}`}>
                      {c.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {!auth?.user ? (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">REGISTER</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">LOGIN</NavLink>
              </li>
            </>
          ) : (
            // User/Admin Dropdown
            <li className="nav-item">
              <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" type="button" id="dropdownUserButton" data-bs-toggle="dropdown" aria-expanded="false">
                  {auth?.user?.name}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownUserButton">
                  <li>
                    <NavLink
                      to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                      className="dropdown-item"
                    >
                      DASHBOARD
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      href="#!"
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      LOGOUT
                    </NavLink>
                  </li>
                </ul>
              </div>
            </li>
          )}

          <li className="nav-item">
            <NavLink to="/cart" className="nav-link btn btn-light">CART{cart?.length}</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
