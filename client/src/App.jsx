import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppSelector } from "./hooks/useAppSelector";
import { selectNotification, selectCartItemsCount } from "./redux/slices/cartSlice";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { closeNotification } from "./redux/slices/cartSlice";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import AppInitializer from "./components/AppInitializer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import AddedToCartNotification from "./components/AddedToCartNotification";
import AdminRoute from "./routes/AdminRoute";
import AdminUsers from "./pages/admin/AdminUsers";
import EditUser from "./pages/admin/EditUser";
import AdminProducts from "./pages/admin/AdminProducts";
import EditProduct from "./pages/admin/EditProduct";
import AdminCategories from "./pages/admin/AdminCategories";
import EditCategory from "./pages/admin/EditCategory";
import AdminOrders from "./pages/admin/AdminOrders";

const AppContent = () => {
  const notification = useAppSelector(selectNotification);
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const dispatch = useAppDispatch();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  const handleCloseNotification = () => {
    dispatch(closeNotification());
  };

  return (
    <AppInitializer>
      <div className="flex flex-col min-h-screen">
      {location.pathname !== "/logout" && (
        <Navbar onLoginClick={() => setShowLogin(true)} />
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={<Cart onLoginClick={() => setShowLogin(true)} />}
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute onLoginClick={() => setShowLogin(true)}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<Success />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/users/:id" element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/products/:id" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          } />
          <Route path="/admin/categories/:id" element={
            <AdminRoute>
              <EditCategory />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
        </Routes>
      </main>
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitch={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
      <Footer />
      {notification.show && (
        <AddedToCartNotification
          productName={notification.productName}
          productImage={notification.productImage}
          productPrice={notification.productPrice}
          quantityAdded={notification.quantityAdded}
          cartItemCount={cartItemsCount}
          onClose={handleCloseNotification}
        />
      )}
      </div>
    </AppInitializer>
  );
};

function App() {
  return <AppContent />;
}

export default App;
