import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { closeNotification } from '../redux/slices/cartSlice';

const AddedToCartNotification = ({ 
  productName, 
  productImage, 
  productPrice, 
  quantityAdded, 
  cartItemCount,
}) => {
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => dispatch(closeNotification()), 300); // Espera la animación
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => dispatch(closeNotification()), 300);
  };

  const getImageSrc = (imageData) => {
    if (typeof imageData === 'string') {
      return imageData;
    }
    if (imageData && imageData.imageData && imageData.imageType) {
      return `data:${imageData.imageType};base64,${imageData.imageData}`;
    }
    return "https://via.placeholder.com/100";
  };

  return (
    <div
      className={`fixed right-4 top-4 mt-20 z-50 max-w-sm transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}
        bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-none`}
      style={{ minWidth: '320px' }}
    >
      <div className="flex items-start space-x-3">
        <img
          src={getImageSrc(productImage)}
          alt={productName}
          className="w-12 h-12 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {productName}
          </p>
          <p className="text-sm text-gray-500">
            Cantidad: {quantityAdded} | ${productPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            Total carrito: {cartItemCount} items
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddedToCartNotification;