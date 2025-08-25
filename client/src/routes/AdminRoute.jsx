import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

const AdminRoute = ({ children }) => {
  const user = useAppSelector((state) => state.user.profile);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userLoading = useAppSelector((state) => state.user.loading);
  
  if (isAuthenticated && token && !user && userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando...</p>
      </div>
    );
  }
  
  if (!isAuthenticated || !token || !user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute; 