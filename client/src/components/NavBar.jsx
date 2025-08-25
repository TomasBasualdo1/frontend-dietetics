import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectCartItems } from "../redux/slices/cartSlice";
import { logoutUser, selectAuthUserId, selectAuthIsAuthenticated } from "../redux/slices/authSlice";
import { selectUserProfile, fetchUserProfile, selectUserLoading, selectUserError } from "../redux/slices/userSlice";
import { selectAdminSuccess } from "../redux/slices/adminSlice";
import AdminLink from "../pages/AdminProduct";
import UserCart from "../components/UserCart";
import { jwtDecode } from "jwt-decode";

const NavBar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const isAuthenticated = useAppSelector(selectAuthIsAuthenticated);
  const userId = useAppSelector(selectAuthUserId);
  const user = useAppSelector(selectUserProfile);
  const userLoading = useAppSelector(selectUserLoading);
  const userError = useAppSelector(selectUserError);
  const token = useAppSelector((state) => state.auth.token);
  const adminSuccess = useAppSelector(selectAdminSuccess);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && token && userId) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded?.role || decoded?.authorities?.[0]?.authority;
        setUserRole(role);
      } catch (error) {
        console.error("Error decodificando token:", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [isAuthenticated, token, userId]);

  useEffect(() => {
    if (adminSuccess && adminSuccess.includes('actualizado') && userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [adminSuccess, userId, dispatch]);

  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/logout');
    } catch (error) {
      console.error('Error durante el logout:', error);
      navigate('/logout');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const userDisponible = !!(user && user.firstName);

  useEffect(() => {
    if ((!userDisponible || userError) && isUserMenuOpen) {
      setIsUserMenuOpen(false);
    }
  }, [userDisponible, userError, isUserMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-white shadow-md font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-['Merriweather'] font-bold text-green-700">
                Dietetica Yuyo
              </span>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Tienda
            </Link>
            <Link
              to="/about"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Sobre nosotros
            </Link>
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-700 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors duration-200"
                aria-label="Buscar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
            <UserCart count={cartItemsCount} />
            {isAuthenticated ? (
              <div className="relative">
                {userLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                    <span className="ml-2 text-green-700">Cargando usuario...</span>
                  </div>
                ) : userError ? (
                  <span className="text-red-600">Usuario no disponible</span>
                ) : userDisponible ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200"
                  >
                    <span>¡Hola, <span className="text-green-600 font-bold">{user.firstName}</span>!</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : null}
                {isUserMenuOpen && userDisponible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {userRole === "ADMIN" && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Administrar
                        </div>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Usuarios
                        </Link>
                        <Link
                          to="/admin/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Órdenes
                        </Link>
                        <Link
                          to="/admin/products"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Productos
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Categorías
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mi cuenta
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Datos personales
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Órdenes
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
              >
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Hamburger for mobile */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-green-600 hover:text-green-700 focus:outline-none transition-colors duration-200"
              aria-label="Abrir menú"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg px-4 pt-2 pb-4 space-y-2 z-50">
          <Link
            to="/"
            className="block text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Tienda
          </Link>
          <Link
            to="/about"
            className="block text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre nosotros
          </Link>
          <form onSubmit={handleSearchSubmit} className="flex items-center py-2">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-l-md p-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-700 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors duration-200"
              aria-label="Buscar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
          <div className="py-2">
            <UserCart count={cartItemsCount} />
          </div>
          {isAuthenticated ? (
            <div className="space-y-1">
              {userRole === "ADMIN" && (
                <>
                  <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administrar</div>
                  <Link to="/admin/users" className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Usuarios</Link>
                  <Link to="/admin/orders" className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Órdenes</Link>
                  <Link to="/admin/products" className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Productos</Link>
                  <Link to="/admin/categories" className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Categorías</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                </>
              )}
              <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mi cuenta</div>
              <Link to="/profile" className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Datos personales</Link>
              <Link to="/orders" className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Órdenes</Link>
              <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600">Cerrar sesión</button>
            </div>
          ) : (
            <button
              onClick={() => { setIsMenuOpen(false); onLoginClick(); }}
              className="block w-full text-left text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200 py-2"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
