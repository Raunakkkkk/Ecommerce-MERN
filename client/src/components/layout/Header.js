import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import SearchInput from "../Form/Searchinput";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/");
  };

  // Handle search icon click - open hamburger menu and focus search
  const handleSearchIconClick = () => {
    // Open the hamburger menu using Bootstrap's collapse functionality
    const navbarCollapse = document.getElementById("navbarTogglerDemo01");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (navbarCollapse && navbarToggler) {
      // Trigger Bootstrap collapse
      new window.bootstrap.Collapse(navbarCollapse, {
        toggle: true,
      });

      // Focus on search input after menu opens
      setTimeout(() => {
        const searchInput = navbarCollapse.querySelector(".form-control");
        if (searchInput) {
          searchInput.focus();
        }
      }, 300); // Wait for animation to complete
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-md bg-white fixed-top shadow-sm position-relative">
        <div className="container-fluid px-2 d-flex align-items-center flex-nowrap">
          {/* Left: Brand Logo */}
          <div className="navbar-left d-flex align-items-center">
            <Link to="/" className="navbar-brand fw-bold text-dark fs-3">
              🛒 Instamart
            </Link>
          </div>

          {/* Center: Search - Hidden on mobile */}
          <div className="navbar-center flex-grow-1 mx-2 d-flex justify-content-center d-none d-md-flex">
            <div className="w-100" style={{ maxWidth: "480px" }}>
              <SearchInput />
            </div>
          </div>

          {/* Right: Search Icon + Toggler + Links */}
          <div className="navbar-right d-flex align-items-center ms-auto">
            {/* Mobile Search Icon (hidden on md and up) */}
            <button
              className="mobile-search-btn border-0 d-md-none me-2"
              type="button"
              onClick={handleSearchIconClick}
              aria-label="Open search"
            >
              <i className="fas fa-search text-dark"></i>
            </button>

            {/* Navbar Toggler for Mobile (hidden on md and up) */}
            <button
              className="navbar-toggler border-0 d-md-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navbar Links */}
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              {/* Mobile Search Input - Only visible on mobile */}
              <div className="mobile-search-container mb-3 d-md-none">
                <SearchInput />
              </div>

              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-start align-items-md-center flex-column flex-md-row">
                {/* Home Link */}
                <li className="nav-item me-3">
                  <NavLink
                    to="/"
                    className="nav-link text-dark fw-medium px-3 py-2 rounded"
                    style={{
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                  >
                    <i className="fas fa-home me-2"></i>
                    Home
                  </NavLink>
                </li>

                {/* Conditional Links for Authenticated and Non-Authenticated Users */}
                {!auth.user ? (
                  <>
                    <li className="nav-item me-3">
                      <NavLink
                        to="/register"
                        className="nav-link text-dark fw-medium px-3 py-2 rounded"
                        style={{
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                        }}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink
                        to="/login"
                        className="nav-link text-dark fw-medium px-3 py-2 rounded"
                        style={{
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                        }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item dropdown me-3">
                      <button
                        className="nav-link dropdown-toggle text-dark fw-medium px-3 py-2 rounded bg-transparent border-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                        }}
                      >
                        <i className="fas fa-user me-2"></i>
                        {auth?.user?.name}
                      </button>
                      <ul className="dropdown-menu border-0 shadow-sm">
                        <li>
                          <NavLink
                            to={`/dashboard/${
                              auth?.user?.role === 1 ? "admin" : "user"
                            }`}
                            className="dropdown-item py-2 px-3 text-dark"
                            style={{ textDecoration: "none" }}
                          >
                            <i className="fas fa-tachometer-alt me-2"></i>
                            Dashboard
                          </NavLink>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="dropdown-item py-2 px-3 text-dark border-0 bg-transparent w-100 text-start"
                            style={{ textDecoration: "none" }}
                          >
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  </>
                )}

                {/* Cart Link with Badge */}
                <li className="nav-item">
                  <Badge count={cart?.length} showZero size="small">
                    <NavLink
                      to="/cart"
                      className="nav-link text-dark fw-medium px-3 py-2 rounded"
                      style={{
                        transition: "all 0.3s ease",
                        textDecoration: "none",
                      }}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      <span className="d-md-none text-dark">Cart</span>
                    </NavLink>
                  </Badge>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
