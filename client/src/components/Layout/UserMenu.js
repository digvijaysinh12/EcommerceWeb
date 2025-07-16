import { Layout } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  const getLinkClass = ({ isActive }) =>
    `list-group-item list-group-item-action${isActive ? " active" : ""}`;

  return (
    <Layout>
      <div className="text-center">
           <NavLink to="/dashboard/user" className="text-decoration-none text-color-white">
            <h4>Dashboard</h4>
          </NavLink>

        <div className="list-group">
          <NavLink to="/dashboard/user/profile" className={getLinkClass}>
            Profile
          </NavLink>
          <NavLink to="/dashboard/user/orders" className={getLinkClass}>
            Orders
          </NavLink>
        </div>
      </div>
    </Layout>
  );
};

export default UserMenu;
