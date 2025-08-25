import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loginUser, clearError } from "../redux/slices/authSlice";

const Login = ({ onClose, onSwitch }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleClose = () => {
    if (location.pathname === "/checkout") {
      navigate("/");
      setTimeout(() => {
        onClose();
      }, 1);
    } else {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "El email es requerido.";
    else if (!validateEmail(formData.email))
      newErrors.email = "Por favor, introduce un email válido.";
    if (!formData.password) newErrors.password = "La contraseña es requerida.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setErrors({});
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-800 hover:text-red-500 text-2xl font-bold"
          aria-label="Cerrar"
        >
          x
        </button>

        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-500 hover:bg-green-700 text-white font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>

          <div className="flex flex-col items-center mt-2">
            <p className="text-center text-sm text-gray-600">
              ¿No tenés una cuenta?{" "}
            </p>
            <button
              onClick={onSwitch}
              className="text-green-600 hover:underline font-semibold text-sm text-center mt-1"
              type="button"
            >
              Registrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
