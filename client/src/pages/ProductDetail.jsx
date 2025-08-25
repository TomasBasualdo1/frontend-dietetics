import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { 
  addToCartWithValidation, 
  selectCartItems,
  selectValidationLoading
} from "../redux/slices/cartSlice";
import { 
  fetchProductById, 
  fetchCategories,
  selectCurrentProduct,
  selectCategories,
  selectProductsLoading,
  selectProductsError
} from "../redux/slices/productSlice";
import AddedToCartNotification from "../components/AddedToCartNotification";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const product = useAppSelector(selectCurrentProduct);
  const categories = useAppSelector(selectCategories);
  const cartItems = useAppSelector(selectCartItems);
  const isLoading = useAppSelector(selectProductsLoading);
  const productsError = useAppSelector(selectProductsError);
  const validationLoading = useAppSelector(selectValidationLoading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = discountPercentage ? parseFloat(discountPercentage) : 0;
    if (numericDiscount > 0) {
      const discountAmount = (numericPrice * numericDiscount) / 100;
      return numericPrice - discountAmount;
    }
    return numericPrice;
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0 || quantity > product.stock) {
      setError("No se puede agregar al carrito: sin stock o cantidad excede stock.");
      return;
    }
    setError(null);
    try {
      await dispatch(addToCartWithValidation({ product, quantity })).unwrap();
    } catch (error) {
      setError(error);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando producto...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded text-lg font-semibold text-center">
          {productsError}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded text-lg font-semibold text-center">
          Producto con ID: {productId} no encontrado.
        </div>
      </div>
    );
  }

  const originalPrice = parseFloat(product.price);
  const discountPercentage = product.discountPercentage ? parseFloat(product.discountPercentage) : 0;
  const effectivePrice = calculateDiscountedPrice(originalPrice, discountPercentage);

  const currentProductInCart = cartItems.find(item => item.id === parseInt(productId));
  const currentProductQuantity = currentProductInCart ? currentProductInCart.quantity : 0;

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No especificada';
  };

  const imageUrl = product.imageData
    ? `data:${product.imageType};base64,${product.imageData}`
    : "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen";

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-3 mt-2 font-['Montserrat']">
          <nav className="text-sm mt-4 mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center text-gray-600">
              <li className="flex items-center">
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Inicio
                </Link>
                <svg className="fill-current w-3 h-3 mx-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li className="flex items-center">
                <Link to="/shop" className="hover:text-green-600 transition-colors">
                  Productos
                </Link>
                <svg className="fill-current w-3 h-3 mx-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li className="flex items-center text-gray-800 font-medium">
                <span>{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>

        <main className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/2 flex flex-col">
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 h-80 sm:h-96 md:h-[450px] flex items-center justify-center bg-gray-100 relative">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-opacity duration-300"
                />
                {discountPercentage > 0 && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-md shadow-lg">
                    {discountPercentage.toFixed(0)}% OFF
                  </span>
                )}
              </div>
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-1">
                  {product.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(url)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-md overflow-hidden flex-shrink-0 transition-all duration-150 hover:opacity-80
                                  ${selectedImage === url ? 'border-green-500 border-2 ring-2 ring-green-300' : 'border-gray-300'}`}
                    >
                      <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-1/2 flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{product.name}</h1>

              <div className="mb-4 mt-2">
                {discountPercentage > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-green-600">
                      {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(effectivePrice)}
                    </p>
                    <p className="text-xl text-gray-400 line-through">
                      {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(originalPrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(originalPrice)}
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Stock disponible:</span>
                  <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock} unidades
                  </span>
                </div>
                
                {product.stock > 0 && (
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-center min-w-[3rem]">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || validationLoading}
                  className={`flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                    validationLoading ? 'opacity-75' : ''
                  }`}
                >
                  {validationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Validando...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-bold">+</span>
                      <span>{product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Cantidad en carrito:</span>
                  <span className="font-semibold">{currentProductQuantity}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductDetail;