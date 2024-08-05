import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Products from './../../pages/Admin/Products';
const AdminMenu = () => {
  const navigate=useNavigate();
  return (
    <>
      <div className="text-center ">
        <div className="list-group">
          <h1 onClick={()=>navigate('/dashboard/admin')}>Admin Panel</h1>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action"
          >
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
Products          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action"
          >
Orders          </NavLink>
         
          {/* <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Users
          </NavLink> */}
        </div>
      </div>
    </>
  );
};

export default AdminMenu;