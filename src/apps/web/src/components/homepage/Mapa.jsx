import React from "react";

export default function Localizacao() {
  const latitude = -19.854910106991262; 
  const longitude = -43.93028148680557;

  return (
    <section id="localizacao" className="section-padding bg-neutral-900">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Título */}
        <h2 className="font-serif text-4xl text-white mb-4">
          Onde Estamos <span className="text-amber-500">Localizados</span>
        </h2>
        <p className="text-neutral-400 mb-10">
          Veja como chegar ao nosso salão de festas
        </p>

        {/* Mapa */}
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border border-white/10 shadow-[0px_0px_40px_rgba(255,191,0,0.35)]">
          <iframe
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Rodapé */}
        <p className="text-neutral-400 mt-6 text-sm">
          Clique em “Ver mapa maior” para abrir diretamente o Google Maps.
        </p>
      </div>
    </section>
  );
}
