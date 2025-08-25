import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchAllCategories,
  createProduct,
  updateProduct,
  selectAdminCategories,
  selectAdminLoading,
  selectAdminError,
  clearError
} from "../../redux/slices/adminSlice";
import {
  fetchProductById,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError
} from "../../redux/slices/productSlice";

const EditProduct = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector(selectAdminCategories);
  const adminLoading = useAppSelector(selectAdminLoading);
  const adminError = useAppSelector(selectAdminError);
  const productsLoading = useAppSelector(selectProductsLoading);
  const productsError = useAppSelector(selectProductsError);
  const currentProduct = useAppSelector(selectCurrentProduct);

  const loading = adminLoading || productsLoading;
  const error = adminError || productsError;

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    discountPercentage: 0
  });
  const [originalProduct, setOriginalProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchAllCategories());
    
    if (!isNew) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (!isNew && currentProduct) {
      setProduct({
        id: currentProduct.id || "",
        name: currentProduct.name || "",
        description: currentProduct.description || "",
        price: currentProduct.price || "",
        stock: currentProduct.stock || "",
        categoryId: currentProduct.categoryId ? String(currentProduct.categoryId) : "",
        discountPercentage: currentProduct.discountPercentage || 0
      });
      setOriginalProduct(currentProduct);
    }
  }, [currentProduct, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setProduct({ ...product, categoryId: e.target.value });
  };

  const handleDiscountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    value = Math.round(value / 5) * 5;
    setProduct({ ...product, discountPercentage: value });
  };

  const handleDiscountStep = (step) => {
    let value = product.discountPercentage + step;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setProduct({ ...product, discountPercentage: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageFileName(file ? file.name : "");
  };

  const hasChanges = () => {
    if (isNew) {
      return (
        product.name.trim() &&
        product.description.trim() &&
        product.price &&
        product.stock &&
        product.categoryId !== ""
      );
    }
    if (!originalProduct) return false;
    
    if (!product.categoryId || product.categoryId === "") {
      return false;
    }
    
    return (
      product.name !== originalProduct.name ||
      product.description !== originalProduct.description ||
      String(product.price) !== String(originalProduct.price) ||
      String(product.stock) !== String(originalProduct.stock) ||
      String(product.categoryId) !== String(originalProduct.categoryId) ||
      product.discountPercentage !== originalProduct.discountPercentage ||
      imageFile
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("categoryId", product.categoryId);
      formData.append("discountPercentage", product.discountPercentage);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      if (isNew) {
        await dispatch(createProduct(formData)).unwrap();
      } else {
        await dispatch(updateProduct({ productId: id, productData: formData })).unwrap();
      }
      navigate("/admin/products");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Cargando producto...</div>;

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded text-lg font-semibold text-center">
            {productsError}
          </div>
        </div>
      );
  }

  if (!isNew && !loading && !currentProduct && id !== "new") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded text-lg font-semibold text-center">
          Producto con ID: {id} no encontrado.
        </div>
      </div>
    );
  }
  if (!product) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">{isNew ? "Crear Producto" : "Editar Producto"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {!isNew && (
          <div>
            <label className="block text-gray-700">ID</label>
            <input value={product.id} disabled className="w-full bg-gray-100 text-gray-500 rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input name="name" value={product.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={product.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-gray-700">Precio</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" step="0.01" />
        </div>
        <div>
          <label className="block text-gray-700">Stock</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" />
        </div>
        <div>
          <label className="block text-gray-700">Categoría</label>
          <select name="categoryId" value={product.categoryId || ""} onChange={handleCategoryChange} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Descuento (%)</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleDiscountStep(-5)} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold" tabIndex={-1}>-</button>
            <input
              type="number"
              name="discountPercentage"
              value={product.discountPercentage}
              readOnly
              className="w-16 border rounded px-2 py-1 text-center bg-gray-100"
            />
            <button type="button" onClick={() => handleDiscountStep(5)} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold" tabIndex={-1}>+</button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Imagen</label>
          {!isNew && currentProduct?.imageData && (
            <div className="mb-2">
              <img
                src={`data:${currentProduct.imageType};base64,${currentProduct.imageData}`}
                alt="Imagen actual del producto"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="flex-1 px-3 py-2 border rounded bg-gray-50 text-gray-700">
              {imageFileName || "Ningún archivo seleccionado"}
            </span>
            <label className="bg-green-200 text-green-900 px-4 py-2 rounded cursor-pointer hover:bg-green-300 font-medium">
              Seleccionar archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {!isNew && (
            <p className="text-xs text-gray-500 mt-1">
              Dejar vacío para mantener la imagen actual
            </p>
          )}
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
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 rounded font-semibold bg-green-200 text-green-900 hover:bg-green-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 