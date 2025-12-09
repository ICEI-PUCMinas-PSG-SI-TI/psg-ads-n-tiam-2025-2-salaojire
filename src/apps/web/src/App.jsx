import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Layout from './components/Layout';
import Homepage from './pages/Homepage';

// Roteador geral e inicio do site, tem o Router que gerência a troca de páginas
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas ficam dentro do Layout (Para que ele seja aplicado em todas) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}