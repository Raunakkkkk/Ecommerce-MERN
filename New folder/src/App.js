import { Routes,Route } from "react-router-dom";
import HomePages from "./pages/HomePages";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProducts from "./pages/Admin/CreateProducts";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <>
<Routes>
<Route path='/' element={<HomePages/>} />
<Route path='/search' element={<Search/>} />
<Route path='/cart' element={<CartPage/>} />
<Route path='/product/:slug' element={<ProductDetails/>} />
<Route path="/dashboard" element={<PrivateRoute/>}>
  {/* pehle humara private route check hoga tb khulega */}
<Route path='user' element={<Dashboard/>} />
{/* dashboard access krne ke liye /dashboard krna hoga */}
<Route path='user/orders' element={<Orders/>} />
<Route path='user/profile' element={<Profile/>} />


</Route>

<Route path="/dashboard" element={<AdminRoute/>}>
  <Route path="admin" element={<AdminDashboard/>}/>
  <Route path="admin/create-category" element={<CreateCategory/>}/>
  <Route path="admin/create-product" element={<CreateProducts/>}/>
  <Route path="admin/product/:slug" element={<UpdateProduct/>}/>
  <Route path="admin/products" element={<Products/>}/>
  <Route path="admin/users" element={<Users/>}/>
</Route>




<Route path='/register' element={<Register/>} />
<Route path='/login' element={<Login/>} />
<Route path='/forgot-password' element={<ForgotPassword/>} />
<Route path='/about' element={<About/>} />
<Route path='/contact' element={<Contact/>} />
<Route path='/policy' element={<Policy/>} />
<Route path='*' element={<Pagenotfound/>} />
{/* upar ke jitne route na mile to ye chalega */}

</Routes>
     
    </>
  );
}

export default App;
