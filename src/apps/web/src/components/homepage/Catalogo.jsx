import React, { useState, useEffect } from 'react';
import { Tag, Package, Loader2, AlertCircle, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import FirebaseAPI from '@packages/firebase';

export default function Catalogo() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [carrinho, setCarrinho] = useState([]);

  const categorias = ['Todos', 'Móveis', 'Brinquedos', 'Utensílios', 'Decoração'];

  useEffect(() => {
    const fetchItens = async () => {
      try {
        setLoading(true);
        const dados = await FirebaseAPI.firestore.itens.getItens();
        setItens(dados);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
        setErro("Não foi possível carregar o catálogo no momento.");
      } finally {
        setLoading(false);
      }
    };
    fetchItens();
  }, []);

  const getItemNoCarrinho = (id) => carrinho.find(i => i.id === id);

  const handleAdicionar = (item) => {
    if (getItemNoCarrinho(item.id)) return;

    
    setCarrinho([...carrinho, { ...item, qtdSolicitada: 1 }]);
  };

  const handleAlterarQuantidade = (id, delta, estoqueMaximo) => {
    setCarrinho(prevCarrinho => prevCarrinho.map(item => {
      if (item.id === id) {
        const novaQtd = item.qtdSolicitada + delta;
        
        if (novaQtd < 1) return item; 
        if (estoqueMaximo && novaQtd > estoqueMaximo) return item;
        return { ...item, qtdSolicitada: novaQtd };
      }
      return item;
    }));
  };

  const handleRemover = (id) => {
    setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.id !== id));
  };


  // Filtro Visual
  const itensFiltrados = categoriaAtiva === 'Todos' 
    ? itens 
    : itens.filter(item => item.categoria === categoriaAtiva);

  return (
    <section id="catalogo" className="section-padding bg-neutral-900 border-t border-neutral-800 relative pb-24">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-white">
            Catálogo de <span className="text-amber-500 italic">Itens</span>
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            Selecione os itens e as quantidades desejadas para montar seu orçamento.
          </p>
        </div>

        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                categoriaAtiva === cat
                  ? 'bg-amber-500 border-amber-500 text-black shadow-lg'
                  : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-amber-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        
        {loading && (
           <div className="flex flex-col items-center justify-center py-20 text-amber-500">
              <Loader2 size={48} className="animate-spin mb-4"/>
              <p>Carregando catálogo...</p>
           </div>
        )}
        {erro && <p className="text-center text-red-500">{erro}</p>}

        
        {!loading && !erro && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itensFiltrados.map((item) => {
              const noCarrinho = getItemNoCarrinho(item.id);
              const estoqueDisponivel = item.quantidade || 0;
              const semEstoque = estoqueDisponivel <= 0;

              return (
                <div key={item.id} className={`group bg-neutral-950 border rounded-xl overflow-hidden transition-all duration-300 ${noCarrinho ? 'border-amber-500 ring-1 ring-amber-500' : 'border-neutral-800 hover:border-amber-500/50'}`}>
                  
                 
                  <div className="relative h-56 overflow-hidden bg-neutral-900">
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs font-bold text-amber-500 flex items-center gap-1 z-10 border border-amber-500/20">
                      <Tag size={12} />
                      {item.categoria || "Geral"}
                    </div>
                    
                    <img 
                      src={item.imageUrl || item.imagemUrl || "https://placehold.co/600x400/1a1a1a/FFF?text=Sem+Imagem"} 
                      alt={item.nome} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${semEstoque ? 'grayscale opacity-50' : 'group-hover:scale-110 opacity-90 group-hover:opacity-100'}`}
                    />

                    {semEstoque && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-white tracking-widest uppercase">Esgotado</div>
                    )}
                  </div>

                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.nome}</h3>
                    
                   
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                        <Package size={12} />
                        <span>Estoque: {estoqueDisponivel} un.</span>
                    </div>

                    <p className="text-neutral-400 text-sm leading-relaxed mb-6 min-h-[40px] line-clamp-2">
                      {item.descricao || "Sem descrição."}
                    </p>
                    
                    <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                      <div className="flex flex-col">
                          <span className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Aluguel</span>
                          <span className="text-white font-bold text-lg">
                              {item.precoAluguel ? `R$ ${parseFloat(item.precoAluguel).toFixed(2).replace('.', ',')}` : "Consulta"}
                          </span>
                      </div>

                      
                      {noCarrinho ? (
                        <div className="flex items-center bg-neutral-800 rounded-lg p-1 border border-amber-500/30">
                            
                            <button 
                                onClick={() => noCarrinho.qtdSolicitada === 1 ? handleRemover(item.id) : handleAlterarQuantidade(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-white hover:text-amber-500 hover:bg-neutral-700 rounded transition-colors"
                            >
                                {noCarrinho.qtdSolicitada === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                            </button>

                            <span className="w-8 text-center font-bold text-amber-500">{noCarrinho.qtdSolicitada}</span>

                            <button 
                                onClick={() => handleAlterarQuantidade(item.id, 1, estoqueDisponivel)}
                                className={`w-8 h-8 flex items-center justify-center text-white rounded transition-colors ${noCarrinho.qtdSolicitada >= estoqueDisponivel ? 'opacity-30 cursor-not-allowed' : 'hover:text-amber-500 hover:bg-neutral-700'}`}
                                disabled={noCarrinho.qtdSolicitada >= estoqueDisponivel}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                      ) : (
                        <button 
                            onClick={() => handleAdicionar(item)}
                            disabled={semEstoque}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                semEstoque 
                                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' 
                                : 'bg-neutral-800 text-neutral-300 hover:bg-amber-600 hover:text-white'
                            }`}
                        >
                          {semEstoque ? 'Indisponível' : 'Adicionar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      
      {carrinho.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-neutral-900 border-t border-amber-500/30 shadow-2xl z-50 p-4 animate-fade-in-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                
                <div className="flex items-center gap-4">
                    <div className="bg-amber-500 p-3 rounded-full text-black">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">
                            {carrinho.length} {carrinho.length === 1 ? 'item selecionado' : 'itens selecionados'}
                        </p>
                        <p className="text-neutral-400 text-sm">
                            Confira os itens e solicite seu orçamento.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
}