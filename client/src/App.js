import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import HomePages from "./pages/HomePages";
import PrivateRoute from "./components/Routes/Private";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./components/Routes/AdminRoute";
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Policy = React.lazy(() => import("./pages/Policy"));
const Pagenotfound = React.lazy(() => import("./pages/Pagenotfound"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const Login = React.lazy(() => import("./pages/Auth/Login"));
const ForgotPassword = React.lazy(() => import("./pages/Auth/ForgotPassword"));
const AdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"));
const CreateCategory = React.lazy(() => import("./pages/Admin/CreateCategory"));
const CreateProducts = React.lazy(() => import("./pages/Admin/CreateProducts"));
const Users = React.lazy(() => import("./pages/Admin/Users"));
const Orders = React.lazy(() => import("./pages/user/Orders"));
const Profile = React.lazy(() => import("./pages/user/Profile"));
const Products = React.lazy(() => import("./pages/Admin/Products"));
const UpdateProduct = React.lazy(() => import("./pages/Admin/UpdateProduct"));
const Search = React.lazy(() => import("./pages/Search"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const AdminOrders = React.lazy(() => import("./pages/Admin/AdminOrders"));
const CartPage = React.lazy(() => import("./pages/CartPage"));

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            {/* pehle humara private route check hoga tb khulega */}
            <Route path="user" element={<Profile />} />
            {/* dashboard access krne ke liye /dashboard krna hoga */}
            <Route path="user/orders" element={<Orders />} />
            <Route path="user/profile" element={<Profile />} />
          </Route>

          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/create-category" element={<CreateCategory />} />
            <Route path="admin/create-product" element={<CreateProducts />} />
            <Route path="admin/product/:slug" element={<UpdateProduct />} />
            <Route path="admin/products" element={<Products />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/orders" element={<AdminOrders />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Pagenotfound />} />
          {/* upar ke jitne route na mile to ye chalega */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
