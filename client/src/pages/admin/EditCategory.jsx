import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  selectAdminCategories,
  selectAdminLoading,
  selectAdminError,
  clearError
} from "../../redux/slices/adminSlice";

const EditCategory = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector(selectAdminCategories);
  const loading = useAppSelector(selectAdminLoading);
  const error = useAppSelector(selectAdminError);

  const [category, setCategory] = useState({
    name: "",
    description: ""
  });
  const [originalCategory, setOriginalCategory] = useState(null);

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!isNew && categories.length > 0) {
      const found = categories.find(c => String(c.id) === String(id));
      if (found) {
        setCategory(found);
        setOriginalCategory(found);
      }
    }
  }, [categories, id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const hasChanges = () => {
    if (isNew) {
      return category.name.trim() && category.description.trim();
    }
    if (!originalCategory) return false;
    return (
      category.name !== originalCategory.name ||
      category.description !== originalCategory.description
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        await dispatch(createCategory(category)).unwrap();
      } else {
        await dispatch(updateCategory({ categoryId: id, categoryData: category })).unwrap();
      }
      navigate("/admin/categories");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Cargando categoría...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!isNew && categories.length > 0 && !categories.find(c => String(c.id) === String(id))) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded text-lg font-semibold text-center">
          Categoría con ID: {id} no encontrada.
        </div>
      </div>
    );
  }
  if (!category) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">{isNew ? "Crear Categoría" : "Editar Categoría"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {!isNew && (
          <div>
            <label className="block text-gray-700">ID</label>
            <input value={category.id} disabled className="w-full bg-gray-100 text-gray-500 rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input name="name" value={category.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={category.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded transition-colors font-semibold ${hasChanges() ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!hasChanges()}
          >
            {isNew ? "Crear" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-2 rounded font-semibold bg-green-200 text-green-900 hover:bg-green-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory; 