import React from 'react';
import { Clock, Star, Users, Heart } from 'lucide-react';

export default function QuemSomos() {
  return (
    <section id="sobre" className="section-padding bg-neutral-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LADO ESQUERDO (Com o texto) */}
        <div>
          <h3 className="text-amber-500 font-bold tracking-widest uppercase mb-2">Quem Somos</h3>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Excelência em cada <span className="italic text-amber-500">detalhe</span>
          </h2>
          <p className="text-neutral-400 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pulvinar ante diam, ac semper elit auctor eu. Quisque pharetra arcu non dolor egestas eleifend. Mauris posuere suscipit malesuada. Morbi nec placerat lacus. Vivamus nec nunc a erat accumsan fringilla non non cras.
          </p>
          <p className="text-neutral-400 mb-8 leading-relaxed">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pulvinar ante diam, ac semper elit auctor eu. Quisque pharetra arcu non dolor egestas eleifend. Mauris posuere suscipit malesuada. Morbi nec placerat lacus. Vivamus nec nunc a erat accumsan fringilla non non cras.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <ItemEspecial icon={<Star />} title="Qualidade Garantida" desc="Excelência total" />
            <ItemEspecial icon={<Users />} title="Equipe Profissional" desc="Prontos para te Atender" />
            <ItemEspecial icon={<Clock />} title="Horário Flexível" desc="Adaptamos aos horários" />
            <ItemEspecial icon={<Heart />} title="Feito com Amor" desc="Cuidado em cada momento" />
          </div>
        </div>

        {/* LADO DIREITO (Imagem com um cartão legal) */}
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border-4 border-neutral-800 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
              alt="Interior do Salão" 
              className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Card Flutuante "4+ Anos" */}
          <div className="absolute -bottom-6 -left-6 bg-amber-500 p-8 rounded-lg shadow-xl max-w-[200px]">
            <span className="block text-4xl font-serif font-bold text-neutral-900">4+</span>
            <span className="text-neutral-900 font-bold leading-tight">Anos de tradição e memórias</span>
          </div>
        </div>

      </div>
    </section>
  );
}

function ItemEspecial({ icon, title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="text-amber-500 mt-1">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{title}</h4>
        <p className="text-neutral-500 text-xs">{desc}</p>
      </div>
    </div>
  );
}