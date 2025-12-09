import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import CatalogoItens from './pages/CatalogoItens';
// Roteador geral e inicio do site, tem o Router que gerência a troca de páginas
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas ficam dentro do Layout para que ele seja aplicado em todas) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/itens" element={<CatalogoItens />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}