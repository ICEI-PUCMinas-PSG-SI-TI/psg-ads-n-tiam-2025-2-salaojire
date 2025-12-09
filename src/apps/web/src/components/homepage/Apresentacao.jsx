import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Imagem do fundo */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop" 
          alt="Salão de Festas Luxuoso" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-neutral-950"></div>
      </div>

      {/* Conteúdo (apresentação)*/}
      <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-amber-500"></div>
          <span className="text-amber-400 uppercase tracking-[0.2em] text-sm font-bold">Desde 2021</span>
          <div className="h-[1px] w-12 bg-amber-500"></div>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
          O Cenário Perfeito para <br />
          <span className="text-amber-500 italic">Sua Celebração</span>
        </h1>
        
        <p className="text-neutral-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
          Transformamos momentos especiais em memórias inesquecíveis. Profissionalismo, conforto e sofisticação para o seu evento.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#contato" className="btn-primary">
            Agendar Visita
          </a>
          <a href="#galeria" className="px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all uppercase tracking-wider font-bold">
            Ver Galeria
          </a>
        </div>
      </div>

      {/* Setinha bonita que fica apontado para baixo */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}