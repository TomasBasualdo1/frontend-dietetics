import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { 
  fetchAllCategories, 
  deleteCategory,
  selectAdminCategories, 
  selectAdminLoading, 
  selectAdminError,
  clearError 
} from "../../redux/slices/adminSlice";

const AdminCategories = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const categories = useAppSelector(selectAdminCategories);
  const loading = useAppSelector(selectAdminLoading);
  const error = useAppSelector(selectAdminError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés borrar esta categoría?")) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando categorías...</p>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800 font-['Merriweather']">
          Panel de Categorías
        </h1>
        <button
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
          onClick={() => navigate("/admin/categories/new")}
        >
          Crear categoría
        </button>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No hay categorías para mostrar
        </div>
      ) : (
        <table className="w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 text-left font-semibold">ID</th>
              <th className="py-2 px-4 text-left font-semibold">Nombre</th>
              <th className="py-2 px-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-t">
                <td className="py-2 px-4 text-left">{category.id}</td>
                <td className="py-2 px-4 text-left">{category.name}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="bg-green-700 hover:bg-green-800 text-white p-2 rounded transition-colors"
                    onClick={() => navigate(`/admin/categories/${category.id}`)}
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" />
                    </svg>
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                    onClick={() => handleDelete(category.id)}
                    title="Borrar"
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

export default AdminCategories; 