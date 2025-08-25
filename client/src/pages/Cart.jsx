import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { 
  selectCartItems, 
  selectCartTotal,
  selectValidationLoading,
  selectValidationError,
  selectRemovedProducts,
  removeFromCart, 
  updateQuantity,
  validateCartItems,
  clearRemovedProducts
} from "../redux/slices/cartSlice";

const Cart = ({ onLoginClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const cartItems = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectCartTotal);
  const validationLoading = useAppSelector(selectValidationLoading);
  const validationError = useAppSelector(selectValidationError);
  const removedProducts = useAppSelector(selectRemovedProducts);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [showRemovedNotification, setShowRemovedNotification] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(validateCartItems());
    }
  }, [dispatch]);

  useEffect(() => {
    if (removedProducts.length > 0) {
      setShowRemovedNotification(true);
      setTimeout(() => {
        dispatch(clearRemovedProducts());
        setShowRemovedNotification(false);
      }, 5000);
    }
  }, [removedProducts, dispatch]);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      onLoginClick();
    } else {
      navigate("/checkout");
    }
  };

  const handleUpdateQuantity = (productId, newQuantity, stock) => {
    dispatch(updateQuantity({ productId, newQuantity, stock }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  if (validationLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 my-24">
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
          Tu Carrito
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-800"></div>
            <p className="text-gray-600">Validando productos del carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 my-24">
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
          Tu Carrito
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <Link
            to="/shop"
            className="inline-block bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-20">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
        Tu Carrito
      </h1>
      
      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          Error al validar los productos del carrito
        </div>
      )}
      
      {showRemovedNotification && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Productos removidos del carrito
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Algunos productos han sido removidos automáticamente porque ya no están disponibles o han sido eliminados.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="divide-y divide-green-200">
          {cartItems.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.imageData && item.imageType
                        ? `data:${item.imageType};base64,${item.imageData}`
                        : (item.imageUrls?.[0] && item.imageUrls[0] !== ""
                            ? item.imageUrls[0]
                            : "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen")
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={e => {
                      if (e.target.src !== "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen") {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen";
                      }
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-green-800 font-medium">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.effectivePrice)} 
                      {item.discountPercentage && item.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(item.price)}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock disponible: {item.stock} unidades
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1, item.stock)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1, item.stock)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Quitar ${item.name} del carrito`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-green-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-green-800">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalAmount)}
            </span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className={`w-full py-3 rounded-lg transition-colors text-white ${validationError ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-800 hover:bg-green-700'}`}
            disabled={!!validationError}
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;