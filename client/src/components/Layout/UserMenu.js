import { Layout } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
const UserMenu = () => {
  return (
    <Layout>
      <div className="text-center">
        <div className="list-group">
          <h4>Dashboard</h4>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action"
          >
            Orders
          </NavLink>
        </div>
      </div>
    </Layout>
  );
};

export default UserMenu;