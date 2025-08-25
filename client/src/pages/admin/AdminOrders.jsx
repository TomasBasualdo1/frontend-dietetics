import React, { useEffect } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { 
  fetchAllOrders, 
  updateOrderStatus,
  selectOrders, 
  selectOrdersLoading, 
  selectOrdersError,
  clearError 
} from "../../redux/slices/orderSlice";

const statusColors = {
  PENDING: "bg-yellow-400 text-white",
  CONFIRMED: "bg-green-700 text-white",
  CANCELLED: "bg-red-600 text-white"
};

const statusLabels = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada"
};

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);

  // Limpiar errores al montar el componente
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleConfirm = async (id) => {
    if (!window.confirm("¿Confirmar esta orden?")) return;
    try {
      await dispatch(updateOrderStatus({ orderId: id, status: 'CONFIRMED' })).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("¿Cancelar esta orden?")) return;
    try {
      await dispatch(updateOrderStatus({ orderId: id, status: 'CANCELLED' })).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando órdenes...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">
        Panel de Órdenes
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No hay órdenes para mostrar
        </div>
      ) : (
        <table className="w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 text-left font-semibold">ID</th>
              <th className="py-2 px-4 text-left font-semibold">Fecha</th>
              <th className="py-2 px-4 text-left font-semibold">ID Usuario</th>
              <th className="py-2 px-4 text-left font-semibold">Email Usuario</th>
              <th className="py-2 px-4 text-left font-semibold">Subtotal</th>
              <th className="py-2 px-4 text-left font-semibold">Estado</th>
              <th className="py-2 px-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="py-2 px-4 text-left">{order.id}</td>
                <td className="py-2 px-4 text-left">{formatDate(order.orderDate)}</td>
                <td className="py-2 px-4 text-left">{order.user?.id}</td>
                <td className="py-2 px-4 text-left">{order.user?.email}</td>
                <td className="py-2 px-4 text-left">
                  {new Intl.NumberFormat("es-AR", { 
                    style: "currency", 
                    currency: "ARS", 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  }).format(order.subtotal)}
                </td>
                <td className="py-2 px-4 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-300 text-gray-700"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="py-2 px-4 flex gap-2">
                  {order.status === "PENDING" && (
                    <>
                      <button
                        className="bg-green-700 hover:bg-green-800 text-white p-2 rounded transition-colors"
                        onClick={() => handleConfirm(order.id)}
                        title="Aceptar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                        onClick={() => handleCancel(order.id)}
                        title="Cancelar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders; 