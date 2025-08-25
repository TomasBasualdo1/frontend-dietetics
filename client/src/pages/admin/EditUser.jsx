import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchAllUsers,
  updateUser,
  createUser,
  selectAdminUsers,
  selectAdminLoading,
  selectAdminError,
  selectAdminSuccess,
  clearError,
  clearSuccess
} from "../../redux/slices/adminSlice";

const EditUser = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector(selectAdminUsers);
  const loading = useAppSelector(selectAdminLoading);
  const error = useAppSelector(selectAdminError);
  const success = useAppSelector(selectAdminSuccess);

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    role: "USER"
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
    if (!isNew) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, isNew]);

  useEffect(() => {
    if (!isNew && users.length > 0) {
      const found = users.find(u => String(u.id) === String(id));
      if (found) {
        setUser({
          id: found.id || "",
          firstName: found.firstName || "",
          lastName: found.lastName || "",
          email: found.email || "",
          address: found.address || "",
          role: found.role || "USER"
        });
        setOriginalUser(found);
      }
    } else if (isNew) {
      setUser({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        role: "USER"
      });
      setOriginalUser(null);
    }
  }, [users, id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRoleChange = (e) => {
    setUser({ ...user, role: e.target.value });
  };

  const hasChanges = () => {
    if (isNew) {
      return Boolean(
        user.firstName.trim() &&
        user.lastName.trim() &&
        user.email.trim() &&
        user.address && user.address.trim() &&
        password.trim()
      );
    }
    if (!originalUser) return false;
    return (
      user.firstName !== originalUser.firstName ||
      user.lastName !== originalUser.lastName ||
      user.email !== originalUser.email ||
      user.role !== originalUser.role ||
      user.address !== originalUser.address
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('password', password);
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('address', user.address);
        
        await dispatch(createUser(formData)).unwrap();
      } else {
        await dispatch(updateUser({ userId: id, userData: user })).unwrap();
      }
      navigate("/admin/users");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  if (!isNew && users.length > 0 && !users.find(u => String(u.id) === String(id))) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Usuario con ID: {id} no encontrado.
        </div>
      </div>
    );
  }
  
  if (!isNew && (!user || !user.id)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando datos del usuario...</p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">{isNew ? "Crear Usuario" : "Editar Usuario"}</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {!isNew && (
          <div>
            <label className="block text-gray-700">ID</label>
            <input value={user.id ?? ""} disabled className="w-full bg-gray-100 text-gray-500 rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input name="firstName" value={user.firstName ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Apellido</label>
          <input name="lastName" value={user.lastName ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input name="email" value={user.email ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Dirección</label>
          <input name="address" value={user.address ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {!isNew && (
          <div>
            <label className="block text-gray-700">Rol</label>
            <select name="role" value={user.role ?? "USER"} onChange={handleRoleChange} className="w-full border rounded px-3 py-2">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        )}
        {isNew && (
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded transition-colors font-semibold ${hasChanges() && !loading ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!hasChanges() || loading}
          >
            {loading ? "Guardando..." : (isNew ? "Crear" : "Guardar")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            disabled={loading}
            className={`px-6 py-2 rounded font-semibold transition-colors ${loading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-200 text-green-900 hover:bg-green-300"}`}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser; 