import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminMenu = ({ loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3">
            <span className="placeholder col-6"></span>
          </div>
          <div className="list-group list-group-flush">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="list-group-item">
                <span className="placeholder col-8"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3">
            <h4
              className="mb-0 fw-bold text-dark"
              onClick={() => navigate("/dashboard/admin")}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-tools me-2"></i>
              Admin Panel
            </h4>
          </div>
          <div className="list-group list-group-flush">
            <NavLink
              to="/dashboard/admin/create-category"
              className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="fas fa-tags me-2 text-muted"></i>
              Create Category
            </NavLink>
            <NavLink
              to="/dashboard/admin/create-product"
              className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="fas fa-plus-circle me-2 text-muted"></i>
              Create Product
            </NavLink>
            <NavLink
              to="/dashboard/admin/products"
              className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="fas fa-boxes me-2 text-muted"></i>
              Products
            </NavLink>
            <NavLink
              to="/dashboard/admin/orders"
              className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="fas fa-clipboard-list me-2 text-muted"></i>
              Orders
            </NavLink>
            <NavLink
              to="/dashboard/admin/users"
              className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="fas fa-users me-2 text-muted"></i>
              Users
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
