import React from 'react';
import { Award, Music, Camera, Utensils, Calendar, Gem } from 'lucide-react';

export default function Servicos() {
  const listaServicos = [
    { icon: <HeartIcon />, title: "Festa de Casamentos", desc: "Descrição" },
    { icon: <Award />, title: "Festas X", desc: "Fiquei sem ideia" },
    { icon: <Gem />, title: "Eventos Corporativos", desc: "Infraestrutura completa para sua empresa." },
    { icon: <Calendar />, title: "Aniversários", desc: "Celebre mais um ano de vida em grande estilo." },
  ];

  const extras = [
    { icon: <Music />, title: "Som e Iluminação" },
    { icon: <Camera />, title: "Espaço para Fotos" },
    { icon: <Utensils />, title: "Cozinha Completa" },
  ];

  return (
    <section id="servicos" className="section-padding bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-amber-500 font-bold tracking-widest uppercase mb-2">O que oferecemos</h3>
          <h2 className="font-serif text-4xl md:text-5xl text-white">
            Nossos <span className="text-amber-500 italic">Serviços</span>
          </h2>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {listaServicos.map((service, index) => (
            <div key={index} className="bg-neutral-950 border border-neutral-800 p-8 rounded-xl hover:border-amber-500/50 transition-colors group cursor-default">
              <div className="w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-neutral-900 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-serif text-white mb-3">{service.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Faixa de Adicionais */}
        <div className="bg-neutral-950 rounded-2xl p-8 border border-neutral-800 flex flex-wrap justify-around gap-8">
          {extras.map((extra, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-amber-500 bg-amber-500/10 p-3 rounded-lg">
                {React.cloneElement(extra.icon, { size: 24 })}
              </div>
              <div>
                <h4 className="text-white font-bold">{extra.title}</h4>
                <p className="text-neutral-500 text-xs">Serviço Premium</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Ícone de coração
function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  )
}