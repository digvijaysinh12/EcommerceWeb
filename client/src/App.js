import { lazy,Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Routes protection
import PrivateRoute from "./components/Routes/Private";
import AdminRoute from "./components/Routes/AdminRoute";

// Lazy - loaded pages
const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Policy = lazy(() => import("./pages/public/Policy"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Orders = lazy(() => import("./pages/user/Orders"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const CreateCategory = lazy(() => import("./pages/admin/CreateCategory"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct"));
const Product = lazy(() => import("./pages/admin/Product"));
const UpdateProduct = lazy(() => import("./pages/admin/UpdateProduct"));
const Users = lazy(() => import("./pages/admin/Users"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));

const Search = lazy(() => import("./pages/public/Search"));
const ProductDetails = lazy(() => import("./pages/public/ProductDetails"));
const Categories = lazy(() => import("./pages/public/Categories"));
const CategoryProduct = lazy(() => import("./pages/public/CategoryProduct"));
const CartPage = lazy(() => import("./pages/public/Cart"));

const PageNotFount = lazy(() => import('./pages/public/NotFound'));


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/categories/category/:slug" element={<CategoryProduct />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path='/productsOne/:slug' element={<ProductDetails />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/policy' element={<Policy />} />

        <Route path="/dashboard">
          {/* User Dashboard Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="user/orders" element={<Orders />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/create-category" element={<CreateCategory />} />
            <Route path="admin/create-product" element={<CreateProduct />} />
            <Route path="admin/product/:slug" element={<UpdateProduct />} />
            <Route path="admin/products" element={<Product />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/users" element={<Users />} />
          </Route>
        </Route>

        {/* Catch-all Route for 404 Page */}
        <Route path='*' element={<PageNotFount />} />
      </Routes>
    </>
  );
}

export default App;
