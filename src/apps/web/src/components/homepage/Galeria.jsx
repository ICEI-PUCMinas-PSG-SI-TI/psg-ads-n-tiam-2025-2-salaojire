import React from 'react';

export default function Galeria() {
  // Depois tem que trocar estas imagens pq são apenas exemplos
  const images = [
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470753937643-efeb931202a9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <section id="galeria" className="section-padding bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-white">Nossa <span className="text-amber-500">Galeria</span></h2>
          <p className="text-neutral-400 mt-4">Momentos eternizados em nosso espaço</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg aspect-square group">
              <img 
                src={src} 
                alt={`Galeria ${idx}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}