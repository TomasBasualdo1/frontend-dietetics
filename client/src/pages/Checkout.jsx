import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { 
  selectCartItems, 
  selectCartTotal,
  selectValidationLoading,
  selectValidationError,
  selectRemovedProducts,
  clearCart,
  validateCartItems,
  clearRemovedProducts
} from "../redux/slices/cartSlice";
import { 
  createOrder, 
  selectOrdersLoading, 
  selectOrdersError,
  clearError 
} from "../redux/slices/orderSlice";
import { selectUserProfile } from "../redux/slices/userSlice";
import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const cartItems = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectCartTotal);
  const validationLoading = useAppSelector(selectValidationLoading);
  const validationError = useAppSelector(selectValidationError);
  const removedProducts = useAppSelector(selectRemovedProducts);
  const user = useAppSelector(selectUserProfile);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);
  
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showRemovedNotification, setShowRemovedNotification] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(validateCartItems());
    }
  }, [dispatch, cartItems.length]);

  useEffect(() => {
    if (removedProducts.length > 0) {
      setShowRemovedNotification(true);
      setTimeout(() => {
        dispatch(clearRemovedProducts());
        setShowRemovedNotification(false);
      }, 5000);
    }
  }, [removedProducts, dispatch]);

  const [addressFormData, setAddressFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address || "",
  });

  const [paymentFormData, setPaymentFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (user?.address && user?.firstName && user?.lastName) {
      setUseDefaultAddress(true);
      setAddressFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
  }, [user]);

  const handleDefaultAddressChange = (e) => {
    const isChecked = e.target.checked;
    setUseDefaultAddress(isChecked);
    
    if (isChecked && user) {
      setAddressFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    } else {
      setAddressFormData({
        firstName: "",
        lastName: "",
        address: "",
      });
    }
  };

  useEffect(() => {
    const validateForms = () => {
      const isPaymentValid = 
        paymentFormData.cardName &&
        paymentFormData.cardNumber.replace(/\s/g, '').length === 16 &&
        paymentFormData.expiry.length === 5 &&
        paymentFormData.cvv.length === 3;

      const isAddressValid = useDefaultAddress ? 
        Boolean(user?.address && user?.firstName && user?.lastName) : 
        (addressFormData.firstName &&
         addressFormData.lastName &&
         addressFormData.address);

      setIsFormValid(isPaymentValid && isAddressValid);
    };

    validateForms();
  }, [useDefaultAddress, addressFormData, paymentFormData, user]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      console.error("Usuario no autenticado. Redirigiendo a login...");
      navigate("/");
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: useDefaultAddress ? user.address : addressFormData.address,
        paymentMethod: {
          type: "CREDIT_CARD",
          cardNumber: paymentFormData.cardNumber.replace(/\s/g, ''),
          expiryDate: paymentFormData.expiry,
        },
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      
      const orderIdMatch = result.message?.match(/Orden de compra número: (\d+)/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;

      dispatch(clearCart());
      navigate("/success", { 
        state: { orderId }
      });
    } catch (error) {
      console.error("Error en el checkout:", error);
    }
  };

  if (validationLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
          Finalizar Compra
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Tu carrito está vacío</h1>
        <button onClick={() => navigate('/shop')} className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600">
          Volver a la tienda
        </button>
      </div>
    );
  }

  const hasDefaultAddress = Boolean(user?.address && user?.firstName && user?.lastName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
        Finalizar Compra
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
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Carrito</h2>
          <div className="divide-y divide-green-200">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageData
                        ? `data:${item.imageType};base64,${item.imageData}`
                        : "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x300/EBF5FB/17202A?text=Error";
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
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-800">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.effectivePrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-green-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Envío</h2>
            
            {hasDefaultAddress && (
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useDefaultAddress}
                    onChange={handleDefaultAddressChange}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Usar dirección guardada
                  </span>
                </label>
              </div>
            )}

            {(!useDefaultAddress || !hasDefaultAddress) && (
              <AddressForm
                formData={addressFormData}
                setFormData={setAddressFormData}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Pago</h2>
            <PaymentForm
              formData={paymentFormData}
              setFormData={setPaymentFormData}
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={!isFormValid || isLoading || !!validationError}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isFormValid && !isLoading && !validationError
                ? 'bg-green-800 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;