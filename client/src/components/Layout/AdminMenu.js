import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const menuItems = [
    { to: "/dashboard/admin/create-category", label: "Create Category" },
    { to: "/dashboard/admin/create-product", label: "Create Product" },
    { to: "/dashboard/admin/products", label: "Products" },
    { to: "/dashboard/admin/orders", label: "Orders" },
    { to: "/dashboard/admin/users", label: "Users" },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      {/* Header */}
      <NavLink to="/dashboard/admin" className="no-underline">
        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Admin Panel</h4>
      </NavLink>

      {/* Links */}
      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `no-underline block px-4 py-2 rounded-md text-gray-700 font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-100 hover:text-indigo-600"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
