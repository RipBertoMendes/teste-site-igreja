import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Ministerios from './pages/Ministerios/Ministerios';
import Principios from './pages/Principios/Principios';
import Eventos from './pages/Eventos/Eventos';
import Perfil from './pages/Perfil/Perfil';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider> 
      <div>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ministerios" element={<Ministerios />} />
            <Route path="/principios" element={<Principios />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
export default App;