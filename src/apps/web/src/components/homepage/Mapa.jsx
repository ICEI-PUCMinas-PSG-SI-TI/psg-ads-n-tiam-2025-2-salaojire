import React from "react";

export default function Localizacao() {
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
            src={`https://maps.google.com/maps/embed?pb=!1m18!1m12!1m3!1d175223.59958910022!2d-43.94196699138951!3d-19.88893107848237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa69b427da7ffd1%3A0xb71cc665e8b8cdc!2sJir%C3%A9%20Festas%20e%20Eventos!5e0!3m2!1spt-BR!2sbr!4v1765310829508!5m2!1spt-BR!2sbr&z=16&output=embed`}
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
