import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext'; // Importe o Provider
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import CatalogoItens from './pages/CatalogoItens';
import Login from './pages/Login';

// Roteador geral e inicio do site, tem o Router que gerência a troca de páginas
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Páginas ficam dentro do Layout para que ele seja aplicado em todas) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="/itens" element={<CatalogoItens />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}