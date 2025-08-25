import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { selectAuthUserId, selectAuthIsAuthenticated, clearError } from '../redux/slices/authSlice';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  selectUserProfile, 
  selectUserLoading, 
  selectUserError,
  clearUserError,
  clearUserProfile
} from '../redux/slices/userSlice';

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const userId = useAppSelector(selectAuthUserId);
  const isAuthenticated = useAppSelector(selectAuthIsAuthenticated);
  const user = useAppSelector(selectUserProfile);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    firstName: '',
    lastName: '',
    imageUrl: '',
    role: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearUserError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      try {
        setIsAdmin(user.role === 'ADMIN');
      } catch (error) {
        console.error('Error verificando rol:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (userId && isAuthenticated) {
      dispatch(fetchUserProfile(userId));
    } else if (!isAuthenticated) {
      navigate('/');
    }
  }, [userId, isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        address: user.address || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageData && user.imageType ? `data:${user.imageType};base64,${user.imageData}` : '',
        role: user.role || ''
      });
      setImagePreview(user.imageData && user.imageType ? `data:${user.imageType};base64,${user.imageData}` : '');
      setOriginalData({
        email: user.email || '',
        address: user.address || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageData && user.imageType ? `data:${user.imageType};base64,${user.imageData}` : '',
        role: user.role || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setDirty(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setDirty(true);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    if (imageFile) return true;
    return Object.keys(formData).some(key => formData[key] !== originalData[key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('address', formData.address);
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      if (formData.role) data.append('role', formData.role);
      if (imageFile) data.append('image', imageFile);

      await dispatch(updateUserProfile({ userId, userData: data })).unwrap();
      
      setImageFile(null);
      setSuccess(true);
      setDirty(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setLocalError(err || 'Error al actualizar el perfil');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-['Merriweather'] font-bold text-green-800 mb-6 text-center">
          Mis Datos Personales
        </h1>
        
        {(localError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {localError || error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Datos actualizados correctamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                title="Editar imagen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de Usuario
                </label>
                <input
                  type="text"
                  value={user?.id || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={!hasChanges() || isLoading}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                hasChanges() && !isLoading
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar datos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 