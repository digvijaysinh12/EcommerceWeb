import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';
import Search from '../Form/Search';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success("Logout Successfully", {
      onClose: () => {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      },
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar shadow-sm">
      <NavLink to="/" className="navbar-brand d-flex align-items-center">
        🛒 ECOMMERCE APP
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <div className='search-bar'>
            <Search />
            </div>
          </li>

          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              HOME
            </NavLink>
          </li>

          <li className="nav-item dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              id="categoryDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              CATEGORY
            </button>
            <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
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

          {!auth?.user ? (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  REGISTER
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  LOGIN
                </NavLink>
              </li>
            </>
          ) : (
            <li className="nav-item dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {auth?.user?.name}
              </button>
              <ul className="dropdown-menu" aria-labelledby="userDropdown">
                <li>
                  <NavLink
                    to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                    className="dropdown-item"
                  >
                    DASHBOARD
                  </NavLink>
                </li>
                <li>
                  <span className="dropdown-item" onClick={handleLogout}>
                    LOGOUT
                  </span>
                </li>
              </ul>
            </li>
          )}

          <li className="nav-item">
            <NavLink to="/cart" className="nav-link cart btn btn-light">
              CART ({cart?.length})
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
