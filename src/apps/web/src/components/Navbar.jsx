import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, User, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signed, user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const profileLink = signed ? "/perfil" : "/login";
  const isHomePage = location.pathname === '/';

  // Isso aqui é para dar o efeito na Navbar quando rola para baixo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fundo preto se não for Home ou se já tiver rolado a tela
  const navBackground = !isHomePage || isScrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6';

  // Função para navegar e rolar
  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);

    if (!isHomePage) {
      // Se estiver na tela de Login/Itens, vai para Home primeiro
      navigate('/');
      // Pequeno delay para dar tempo da Home carregar antes de rolar
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Se já estiver na Home, só rola para a seção
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBackground}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo Link para Home */}
        <Link to="/" className="flex items-center" onClick={() => window.scrollTo(0, 0)}>
          <Logo
            className={`transition-all duration-300 ${!isHomePage || isScrolled ? 'h-12' : 'h-16'}`}
          />
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNavClick('home')} className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors cursor-pointer">Início</button>
          <button onClick={() => handleNavClick('sobre')} className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors cursor-pointer">Sobre</button>

          {/* Link para Itens */}
          <Link onClick={() => window.scrollTo(0, 0)} to="/itens" className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors flex items-center gap-1">
            Nossos Itens
          </Link>

          <button onClick={() => handleNavClick('galeria')} className="text-neutral-300 hover:text-white text-sm uppercase tracking-widest transition-colors cursor-pointer">Galeria</button>

          <div className="flex items-center gap-4 pl-4">
            <a href="https://wa.me/5531987722422" target="_blank" className="flex items-center gap-2 border border-amber-500 text-amber-500 px-5 py-2 rounded-full hover:bg-amber-500 hover:text-black transition-all font-bold text-sm">
              <Phone size={16} />
              <span>(31) 98772-2422</span>
            </a>

            {/* Botão de Perfil -> Link para Login ou Perfil*/}
            <Link
              onClick={() => window.scrollTo(0, 0)}
              to={profileLink}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 group 'border-white/20 text-white hover:bg-amber-500 hover:border-amber-500 hover:text-black'`}
              title={signed ? `Olá, ${user?.name}` : "Área do Cliente"}
            >
              <User size={18} />
            </Link>
            {/* Botão de Sair  */}
            {signed && (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
              >
                <X size={16} />
                Sair
              </button>
            )}
          </div>
        </div>

        {/* Caso for mobile, vai ter o botão para abrir o menuzinho */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-neutral-900 border-t border-neutral-800 p-6 flex flex-col gap-4 shadow-2xl md:hidden">
          <button onClick={() => handleNavClick('home')} className="text-left text-neutral-300 hover:text-amber-500">Início</button>
          <button onClick={() => handleNavClick('sobre')} className="text-left text-neutral-300 hover:text-amber-500">Sobre</button>

          <Link to="/itens" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-amber-500 flex items-center gap-2">
            <ShoppingBag size={16} /> Nossos Itens
          </Link>

          <button onClick={() => handleNavClick('galeria')} className="text-left text-neutral-300 hover:text-amber-500">Galeria</button>

          <Link
            to={profileLink}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 mt-2 border border-neutral-700 rounded text-neutral-300 hover:text-white hover:border-amber-500 transition-all"
          >
            <User size={18} />
            <span>{signed ? 'Meu Perfil' : 'Área do Cliente'}</span>
          </Link>

          <a href="https://wa.me/5531987722422" target="_blank" className="bg-amber-600 text-white text-center py-3 rounded font-bold">Solicitar Orçamento</a>
        </div>
      )}
    </nav>
  );
}