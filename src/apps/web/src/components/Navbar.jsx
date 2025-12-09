import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import Logo from '../assets/Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Isso aqui é para dar o efeito na Navbar quando rola para baixo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center">
             <Logo 
               className={`transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`} 
             />
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors">Início</a>
          <a href="#sobre" className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors">Sobre</a>
          <a href="#servicos" className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors">Serviços</a>
          <a href="#galeria" className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors">Galeria</a>

          <a href="#contato" className="flex items-center gap-2 border border-amber-500 text-amber-500 px-5 py-2 rounded-full hover:bg-amber-500 hover:text-black transition-all font-bold text-sm">
            <Phone size={16} />
            <span>(31) 98772-2422</span>
          </a>
        </div>

        {/* Caso for mobile, vai ter o botão para abrir o menuzinho */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menu para o Mobile */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-neutral-900 border-t border-neutral-800 p-6 flex flex-col gap-4 shadow-2xl md:hidden">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-amber-500">Início</a>
          <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-amber-500">Sobre</a>
          <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-amber-500">Serviços</a>
          <a href="#galeria" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-amber-500">Galeria</a>
          <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="bg-amber-600 text-white text-center py-3 rounded font-bold">Solicitar Orçamento</a>
        </div>
      )}
    </nav>
  );
}