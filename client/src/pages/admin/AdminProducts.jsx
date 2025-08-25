import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { 
  fetchProducts, 
  fetchCategories,
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError
} from "../../redux/slices/productSlice";
import {
  deleteProduct,
  selectAdminLoading,
  selectAdminError,
  clearError
} from "../../redux/slices/adminSlice";

const AdminProducts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const adminLoading = useAppSelector(selectAdminLoading);
  const adminError = useAppSelector(selectAdminError);

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "-";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés borrar este producto?")) return;
    
    try {
      await dispatch(deleteProduct(id)).unwrap();
      // Recargar productos después de eliminar
      dispatch(fetchProducts());
    } catch (error) {
      alert(error || "Error al borrar producto");
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando productos...</p>
      </div>
    );
  }
  
  if (error || adminError) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || adminError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800 font-['Merriweather']">
          Panel de Productos
        </h1>
        <button
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
          onClick={() => navigate("/admin/products/new")}
        >
          Crear producto
        </button>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No hay productos para mostrar
        </div>
      ) : (
      <table className="w-full border rounded-lg bg-white">
        <thead>
          <tr className="bg-green-100">
            <th className="py-2 px-4 text-left font-semibold">ID</th>
            <th className="py-2 px-4 text-left font-semibold">Nombre</th>
            <th className="py-2 px-4 text-left font-semibold">Precio</th>
            <th className="py-2 px-4 text-left font-semibold">Stock</th>
            <th className="py-2 px-4 text-left font-semibold">Categoría</th>
            <th className="py-2 px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="py-2 px-4 text-left">{product.id}</td>
              <td className="py-2 px-4 text-left">{product.name}</td>
              <td className="py-2 px-4 text-left">${product.price}</td>
              <td className="py-2 px-4 text-left">{product.stock}</td>
              <td className="py-2 px-4 text-left">{getCategoryName(product.categoryId)}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-green-700 hover:bg-green-800 text-white p-2 rounded transition-colors"
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" />
                  </svg>
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                  onClick={() => handleDelete(product.id)}
                  title="Borrar"
                  disabled={adminLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default AdminProducts; 