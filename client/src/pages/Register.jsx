import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = ({ onClose, onSwitch }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
      navigate("/");
    }
  }, [isAuthenticated, onClose, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre del usuario es requerido.";
    }
    if (!formData.lastName.trim())
      newErrors.lastName = "El apellido del usuario es requerido.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      dispatch(registerUser(formData));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div
        className="bg-white p-10 rounded-lg shadow-2xl w-96 max-w-[500px] max-h-[600px] overflow-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overflow: "auto",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-800 hover:text-red-500 text-xl font-bold"
          aria-label="Cerrar"
        >
          x
        </button>

        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Registro
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          style={{ overflow: "hidden" }}
        >
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            type="password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

          <div className="flex flex-col items-center mt-2">
            <p className="text-center text-sm text-gray-600">
              ¿Ya tenes una cuenta?{" "}
            </p>
            <button
              onClick={onSwitch}
              className="text-green-600 hover:underline font-semibold text-sm text-center mt-1"
              type="button"
            >
              Inicia sesion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
