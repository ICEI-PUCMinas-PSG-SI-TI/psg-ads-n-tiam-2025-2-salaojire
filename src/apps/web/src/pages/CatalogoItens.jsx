import React from 'react';
import { Search } from 'lucide-react';

export default function CatalogoItens() {
  // Tem que fazer a lógica de pegar os itens aqui, a estrutura dos itens no firebase é assim:
  const items = [
    { 
      id: 1, 
      nome: "Item 1", 
      descricao: "Descrição do item exemplo 1",
      imageUrl: "https://placehold.co/80x400?text=Item+1",
      precoAluguel: 10,
      quantidade: 1 
    },
    { 
      id: 2, 
      nome: "Item 2", 
      descricao: "Descrição do item exemplo 2",
      imageUrl: "https://placehold.co/80x400?text=Item+2",
      precoAluguel: 20,
      quantidade: 2  
    },
    { 
      id: 3, 
      nome: "Item 3", 
      descricao: "Descrição do item exemplo 3",
      imageUrl: "https://placehold.co/80x400?text=Item+3",
      precoAluguel: 30,
      quantidade: 40  
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-white mb-4">Nossos <span className="text-amber-500">Itens</span></h1>
        <p className="text-neutral-400">Confira o que já está incluso ou disponível.</p>
      </div>

      {/* Grid com os itens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
            <img src={item.imageUrl} alt={item.nome} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-white font-bold">{item.nome}</h3>
              <h4 className="text-neutral-300 text-xs">{`Quantidade dispónivel: ${item.quantidade}`}</h4>
              <p className="text-amber-500 text-sm pt-3">{item.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}