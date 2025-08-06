import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import SearchInput from "../Form/Searchinput";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

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
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            🛒Instamart
          </Link>

          {/* Navbar Toggler for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Navbar Links */}
          <div className=" collapse navbar-collapse" id="navbarTogglerDemo01">
            {/* Search Input */}
            <div className="d-flex justify-content-center flex-grow-1">
              <SearchInput />
            </div>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Home Link */}
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  <i className="fas fa-home me-1"></i>
                  Home
                </NavLink>
              </li>

              {/* Conditional Links for Authenticated and Non-Authenticated Users */}
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      <i className="fas fa-user-plus me-1"></i>
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-user me-1"></i>
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item"
                          style={{
                            border: "none",
                            background: "none",
                            width: "100%",
                            textAlign: "left",
                          }}
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
              <li className="nav-item mt-2">
                <Badge count={cart?.length} showZero>
                  <NavLink to="/cart" className="nav-link">
                    <i className="fas fa-shopping-cart"></i>
                  </NavLink>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
