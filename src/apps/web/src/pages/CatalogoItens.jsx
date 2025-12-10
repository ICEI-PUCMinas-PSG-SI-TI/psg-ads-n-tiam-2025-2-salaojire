import React, { useState, useEffect, useRef } from 'react';
import { Package, Loader2, ShoppingBag, Plus, Minus, Trash2, User, Phone, MessageSquare, Send, ChevronDown, Calendar, CalendarDays } from 'lucide-react';
import FirebaseAPI from '@packages/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore'; 

export default function Catalog() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const { signed, user } = useAuth();

  const [carrinho, setCarrinho] = useState([]);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    mensagem: '',
    dataInicio: '',
    dataFim: ''
  });

  const formRef = useRef(null);

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

  // Carrinho
  const getItemNoCarrinho = (id) => carrinho.find(i => i.id === id);

  const handleAdicionar = (item) => {
    if (getItemNoCarrinho(item.id)) {
        scrollToForm();
        return;
    }
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formulário
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const enviarOrcamento = async (e) => {
    e.preventDefault();
    
    const temItens = carrinho.length > 0;

    // Validação de datas
    if (temItens && (!formData.dataInicio || !formData.dataFim)) {
      alert("Por favor, selecione as datas de início e fim do evento para prosseguir com o orçamento.");
      return;
    }

    // Salvar no firebase se tiver logado
    if (signed && user?.id) {
      try {
        let dataInicioTimestamp = null;
        let dataFimTimestamp = null;

        if (formData.dataInicio) {
             const dataInicioObj = new Date(formData.dataInicio + 'T12:00:00');
             dataInicioTimestamp = Timestamp.fromDate(dataInicioObj);
        }
        
        if (formData.dataFim) {
            const dataFimObj = new Date(formData.dataFim + 'T12:00:00');
            dataFimTimestamp = Timestamp.fromDate(dataFimObj);
        }

        const novaSolicitacao = {
          dataSolicitacao: Timestamp.now(),
          dataInicio: dataInicioTimestamp, 
          dataFim: dataFimTimestamp,
          descricao: `Solicitação via Site. Contato: ${formData.telefone}. Msg: ${formData.mensagem || 'Sem observações.'}`,
          status: "pendente",
          itensSolicitados: carrinho.map(item => ({
            id: item.id,
            nome: item.nome,
            quantidade: item.qtdSolicitada,
            imageUrl: item.imageUrl || item.imagemUrl || null,
            precoAluguel: item.precoAluguel || 0
          }))
        };

        await FirebaseAPI.firestore.clientes.addSolicitacaoToCliente(user.id, novaSolicitacao);
        console.log("Solicitação salva no histórico com sucesso!");
        
      } catch (error) {
        console.error("Erro ao salvar solicitação:", error);
      }
    }

    // Enviar WhatsApp
    const telefoneDestino = "5531987722422";
    let texto = "";

    texto += `*Olá! Meu nome é ${formData.nome}.*\n`;
    texto += `Telefone: ${formData.telefone}\n\n`;

    if (temItens) {
      texto += "*Gostaria de um orçamento para:*\n";
      const dataInicioFormatada = formData.dataInicio.split('-').reverse().join('/');
      const dataFimFormatada = formData.dataFim.split('-').reverse().join('/');
      
      texto += `📅 Data: ${dataInicioFormatada} até ${dataFimFormatada}\n\n`;
      
      texto += "*Itens Selecionados:*\n";
      carrinho.forEach(item => {
        texto += `▪ ${item.qtdSolicitada}x ${item.nome}\n`;
      });
      texto += "\n";
    } else {
      texto += "*Gostaria de tirar algumas dúvidas sobre o salão.*\n\n";
    }

    if (formData.mensagem) {
      texto += `*Mensagem:* ${formData.mensagem}\n`;
    }

    texto += "\n*Aguardo retorno!*";

    const link = `https://wa.me/${telefoneDestino}?text=${encodeURIComponent(texto)}`;
    window.open(link, '_blank');
  };

  const temItensNoCarrinho = carrinho.length > 0;

  return (
    <div className="min-h-screen bg-neutral-900">
      
      {/* Grid de Itens */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              Nossos <span className="text-amber-500 italic">Itens</span>
            </h2>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
              Confira os itens disponíveis. Adicione ao carrinho para compor sua lista de desejos e solicite o orçamento abaixo.
            </p>
          </div>

          {loading && (
             <div className="flex flex-col items-center justify-center py-20 text-amber-500">
                <Loader2 size={48} className="animate-spin mb-4"/>
                <p>Carregando itens...</p>
             </div>
          )}
          {erro && <p className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg">{erro}</p>}

          {!loading && !erro && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itens.map((item) => {
                const noCarrinho = getItemNoCarrinho(item.id);
                const estoqueDisponivel = item.quantidade || 0;
                const semEstoque = estoqueDisponivel <= 0;

                return (
                  <div key={item.id} className={`group bg-neutral-950 border rounded-xl overflow-hidden transition-all duration-300 ${noCarrinho ? 'border-amber-500 ring-1 ring-amber-500' : 'border-neutral-800 hover:border-amber-500/50'}`}>
                    <div className="relative h-56 overflow-hidden bg-neutral-900">
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
                          <span>Disponíveis: {estoqueDisponivel}</span>
                      </div>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-6 min-h-[40px] line-clamp-2">
                        {item.descricao || "Sem descrição disponível."}
                      </p>
                      
                      <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Preço</span>
                            <span className="text-white font-bold text-sm italic text-amber-500/80">
                                Sob Consulta
                            </span>
                        </div>

                        {noCarrinho ? (
                          <div className="flex items-center bg-neutral-800 rounded-lg p-1 border border-amber-500/30">
                              <button onClick={() => noCarrinho.qtdSolicitada === 1 ? handleRemover(item.id) : handleAlterarQuantidade(item.id, -1)} className="cursor-pointer w-8 h-8 flex items-center justify-center text-white hover:text-amber-500 hover:bg-neutral-700 rounded transition-colors">
                                  {noCarrinho.qtdSolicitada === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                              </button>
                              <span className="w-8 text-center font-bold text-amber-500">{noCarrinho.qtdSolicitada}</span>
                              <button onClick={() => handleAlterarQuantidade(item.id, 1, estoqueDisponivel)} className={`cursor-pointer w-8 h-8 flex items-center justify-center text-white rounded transition-colors ${noCarrinho.qtdSolicitada >= estoqueDisponivel ? 'opacity-30 cursor-not-allowed' : 'hover:text-amber-500 hover:bg-neutral-700'}`} disabled={noCarrinho.qtdSolicitada >= estoqueDisponivel}>
                                  <Plus size={16} />
                              </button>
                          </div>
                        ) : (
                          <button onClick={() => handleAdicionar(item)} disabled={semEstoque} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${semEstoque ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' : 'bg-neutral-800 text-neutral-300 hover:bg-amber-600 hover:text-white'}`}>
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
      </section>

      {/* Formulário Híbrido */}
      <section ref={formRef} className="py-20 bg-black border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Coluna da Esquerda (Formulário) */}
            <div>
              <h3 className="font-serif text-3xl text-white mb-2">
                {temItensNoCarrinho ? 'Solicitar ' : 'Fale '} 
                <span className="text-amber-500">{temItensNoCarrinho ? 'Orçamento' : 'Conosco'}</span>
              </h3>
              <p className="text-neutral-400 mb-8">
                {temItensNoCarrinho 
                  ? 'Preencha as datas do seu evento e seus dados para verificar a disponibilidade dos itens selecionados.' 
                  : 'Preencha seus dados abaixo para tirar dúvidas ou solicitar informações gerais.'}
              </p>

              <form onSubmit={enviarOrcamento} className="space-y-6">
                {temItensNoCarrinho && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-900 border border-amber-500/20 rounded-lg animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={14}/> Início do Evento
                      </label>
                      <input 
                        type="date" 
                        name="dataInicio"
                        required={temItensNoCarrinho}
                        value={formData.dataInicio}
                        onChange={handleFormChange}
                        className="cursor-text w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:border-amber-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                        <CalendarDays size={14}/> Fim do Evento
                      </label>
                      <input 
                        type="date" 
                        name="dataFim"
                        required={temItensNoCarrinho}
                        value={formData.dataFim}
                        onChange={handleFormChange}
                        className="cursor-text w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:border-amber-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                    <User size={16} className="text-amber-500"/> Seu Nome
                  </label>
                  <input 
                    type="text" 
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleFormChange}
                    placeholder="Como podemos te chamar?"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                    <Phone size={16} className="text-amber-500"/> Seu WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleFormChange}
                    placeholder="(DD) 99999-9999"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                    <MessageSquare size={16} className="text-amber-500"/> Mensagem Adicional (Opcional)
                  </label>
                  <textarea 
                    name="mensagem"
                    rows="4"
                    value={formData.mensagem}
                    onChange={handleFormChange}
                    placeholder="Dúvidas ou observações..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white focus:border-amber-500 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="cursor-pointer w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/20"
                >
                  <Send size={20} /> 
                  {temItensNoCarrinho ? 'Solicitar Orçamento no WhatsApp' : 'Enviar Mensagem no WhatsApp'}
                </button>
              </form>
            </div>

            {/* Coluna da Direita (Resumo do Carrinho) */}
            <div className={`bg-neutral-900 rounded-2xl p-8 border h-fit transition-all duration-500 ${temItensNoCarrinho ? 'border-amber-500/30 shadow-lg shadow-amber-900/10' : 'border-neutral-800'}`}>
              <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
                <ShoppingBag className={temItensNoCarrinho ? "text-amber-500" : "text-neutral-600"} size={24} />
                <h4 className="text-xl font-bold text-white">Resumo do Pedido</h4>
              </div>

              {!temItensNoCarrinho ? (
                <div className="text-center py-10 text-neutral-500">
                  <Package size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Nenhum item selecionado.</p>
                  <p className="text-xs mt-2">Você pode enviar uma mensagem de contato geral preenchendo o formulário ao lado.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {carrinho.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-neutral-800">
                      <img 
                        src={item.imageUrl || item.imagemUrl || "https://placehold.co/100"} 
                        alt={item.nome}
                        className="w-16 h-16 object-cover rounded bg-neutral-800"
                      />
                      <div className="flex-1">
                        <h5 className="text-white font-bold text-sm line-clamp-1">{item.nome}</h5>
                        <p className="text-amber-500 text-xs mt-1">Quantidade: {item.qtdSolicitada}</p>
                      </div>
                      <button 
                        onClick={() => handleRemover(item.id)}
                        className="cursor-pointer text-neutral-600 hover:text-red-500 transition-colors p-2"
                        title="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {temItensNoCarrinho && (
                 <div className="mt-6 pt-4 border-t border-neutral-800 text-right">
                    <p className="text-neutral-400 text-sm">Total de Itens: <span className="text-white font-bold">{carrinho.reduce((acc, item) => acc + item.qtdSolicitada, 0)}</span></p>
                 </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Botão Flutuante */}
      {temItensNoCarrinho && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <button onClick={scrollToForm} className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105">
            <ShoppingBag size={20} />
            <span className="hidden md:inline">Finalizar Orçamento ({carrinho.length})</span>
            <span className="md:hidden">({carrinho.length})</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
}