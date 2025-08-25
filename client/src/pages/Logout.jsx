import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logoutUser } from '../redux/slices/authSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logoutUser());

    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-['Merriweather'] font-bold text-green-800 mb-6">
        Cerrando sesión
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        ¡Esperamos volver a verte pronto!
      </p>
      <p className="text-sm text-gray-500">
        Redirigiendo a la página principal...
      </p>
    </div>
  );
};

export default Logout; 