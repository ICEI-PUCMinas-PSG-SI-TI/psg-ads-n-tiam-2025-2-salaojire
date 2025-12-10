import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

// Layout geral de todas as páginas, coloca a navbar em cima e o footer em baixo
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-200">
      <Navbar />
      
      {/* O Outlet é onde o conteúdo da página atual será carregado */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}