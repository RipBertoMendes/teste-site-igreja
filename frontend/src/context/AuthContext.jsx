import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const loggedUser = response.data.user;
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      navigate('/perfil');
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error.response.data.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error.response.data.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateUser = async (updatedData) => {
    if (!user) return;
    try {
      const response = await api.put(`/users/${user.id}`, updatedData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.response.data.message);
      throw error;
    }
  };

  const addMinistry = async (ministryName) => {
    if (!user) return;
    try {
      const response = await api.post(`/users/${user.id}/ministerios`, { ministry: ministryName });
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar ministério:', error.response.data.message);
      throw error;
    }
  };

  const removeMinistry = async (ministryName) => {
    if (!user) return;
    try {
      const response = await api.delete(`/users/${user.id}/ministerios`, { data: { ministry: ministryName } });
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Erro ao remover ministério:', error.response.data.message);
      throw error;
    }
  };

  const uploadPhoto = async (file) => {
    if (!user) return;
    const formData = new FormData();
    formData.append('profilePhoto', file);
    try {
      const response = await api.post(`/users/${user.id}/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error.response?.data?.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, addMinistry, removeMinistry, uploadPhoto }}>
      {children}
    </AuthContext.Provider>
  );
}; 

export const useAuth = () => {
  return useContext(AuthContext);
};