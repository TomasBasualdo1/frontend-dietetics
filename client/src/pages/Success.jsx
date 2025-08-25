import React from "react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-4">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu orden #{orderId} ha sido procesada exitosamente.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

export default Success; 