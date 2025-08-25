import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { 
  fetchProducts, 
  fetchCategories, 
  fetchProductsByCategory,
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  setFilter,
  clearFilters
} from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSortChange = (sortType) => {
    const queryParams = new URLSearchParams(location.search);
    if (sortType === "") {
      queryParams.delete("sort");
    } else {
      queryParams.set("sort", sortType);
    }
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");
    const sortType = queryParams.get("sort");

    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.categoryId)
      );
    }

    if (sortType) {
      filtered.sort((a, b) => {
        switch (sortType) {
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "price_asc":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price_desc":
            return parseFloat(b.price) - parseFloat(a.price);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, location.search, selectedCategories]);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1"></div>
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 text-center flex-1">
          Nuestros Productos
        </h1>
        <div className="w-48 flex-1 flex justify-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={new URLSearchParams(location.search).get("sort") || ""}
            >
              <option value="">Sin ordenar</option>
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="name_desc">Nombre (Z-A)</option>
              <option value="price_asc">Precio (menor a mayor)</option>
              <option value="price_desc">Precio (mayor a menor)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <div className="w-56 bg-white p-4 rounded-lg shadow-md h-fit">
            <h3 className="text-lg font-bold mb-4 text-green-800">Categorías</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 ml-6">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                <p className="ml-4 text-green-700">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                <p>{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-1 justify-items-center">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">
                  No se encontraron productos que coincidan con tu búsqueda o filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;