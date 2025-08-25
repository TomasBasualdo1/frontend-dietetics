import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchUserOrders, 
  selectUserOrders, 
  selectOrdersLoading, 
  selectOrdersError 
} from '../redux/slices/orderSlice';
import { selectUserProfile } from '../redux/slices/userSlice';

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.userId);
  const user = useAppSelector(selectUserProfile);
  const orders = useAppSelector(selectUserOrders);
  const isLoading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'CONFIRMED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'PENDIENTE';
      case 'CONFIRMED':
        return 'CONFIRMADA';
      case 'CANCELLED':
        return 'CANCELADA';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserOrders());
    } else if (!isAuthenticated) {
      navigate('/');
    }
  }, [dispatch, isAuthenticated, userId, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8 text-center">
        Mis Órdenes
      </h1>
      
      {!orders ? (
        <div className="text-center text-gray-600">
          <p className="text-lg mb-2">Cargando órdenes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg mb-2">No tenés ninguna orden todavía</p>
          <p className="text-sm">¡Hacé tu primera compra en nuestra tienda!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Orden #{order.id}
                  </h2>
                  <p className="text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ${order.subtotal.toFixed(2)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Productos:</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="text-gray-800">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 