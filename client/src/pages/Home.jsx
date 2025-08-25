import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { 
  fetchProducts, 
  fetchCategories,
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  selectCategoriesError
} from "../redux/slices/productSlice";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const dispatch = useAppDispatch();
  
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectProductsLoading);
  const productsError = useAppSelector(selectProductsError);
  const categoriesError = useAppSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 4);

  const randomCategories = categories.length > 0
    ? [...categories].sort(() => 0.5 - Math.random()).slice(0, 3)
    : [];

  return (
    <>
      <Hero />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-green-800 mb-2">Envíos Rápidos</h3>
              <p className="text-gray-700">Recibí tus productos en la comodidad de tu hogar.</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-green-800 mb-2">Compra Segura</h3>
              <p className="text-gray-700">Tus datos y pagos siempre protegidos.</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-green-800 mb-2">Atención Personalizada</h3>
              <p className="text-gray-700">Estamos para ayudarte en lo que necesites.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Merriweather'] font-bold text-green-800 text-center mb-10">
            Productos destacados
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="ml-4 text-green-700">Cargando destacados...</p>
            </div>
          ) : productsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              <p>{productsError}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay productos destacados para mostrar.</p>
          )}
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-block bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Merriweather'] font-bold text-green-800 text-center mb-10">
            Explorá nuestras categorías
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="ml-4 text-green-700">Cargando categorías...</p>
            </div>
          ) : categoriesError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              <p>{categoriesError}</p>
            </div>
          ) : randomCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomCategories.map((cat) => (
                <div key={cat.id} className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-bold text-green-700 mb-2">{cat.name}</h3>
                  <p className="text-gray-600">{cat.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay categorías para mostrar.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;