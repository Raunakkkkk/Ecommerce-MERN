import React from "react";
import { NavLink, Link } from "react-router-dom";
// import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import Search from "antd/es/input/Search";
import SearchInput from "../Form/Searchinput";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
const Header = () => {
  // login data ke loye to check if user login or not
  const [auth,setAuth]=useAuth();

const [cart,setCart]=useCart();

  //logout ke liye local storage se auth ko hatana padega
  const handleLogout=()=>{
    setAuth({
      ...auth,
      //sprea isliye kr rhe kyulki isme user ur token ke alawa bhi data ho sakte to vo chahiye rahega
      user:null,
      token:""
    });
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');

  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
        <Link to="/" className="navbar-brand">
              🛒 Ecommerce Website
            </Link>
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
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
<SearchInput/>

              <li className="nav-item">
                <NavLink to="/" className="nav-link ">
                  Home
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink to="/category" className="nav-link ">
                  Category
                </NavLink>
              </li> */}
            {
              //checking if user exist in auth 
              !auth.user ?(<>
                <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
              </>):(
                <>
              <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
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
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )
            }

              <li className="nav-item mt-2">
              <Badge count={cart?.length} showZero>
                  <NavLink to="/cart" className="nav-link">
                    Cart
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