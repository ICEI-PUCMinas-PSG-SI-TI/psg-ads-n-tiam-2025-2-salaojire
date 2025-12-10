import React from 'react';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import Logo from '../assets/Logo';
import { Instagram, WhatsApp} from '../assets/SocialMedia'
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer id="contato" className="bg-black pt-20 pb-10 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Coluna 1 (Marca) */}
        <div>
          <div className="mb-6">
            <Logo className="h-24" />
          </div>
          <p className="text-neutral-400 mb-6">
            O espaço ideal para sua família. Estrutura completa, preço justo e atendimento feito diretamente pelos proprietários.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/jirefestaseeventos/" target="_blank" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
              <Instagram size={20}/>
            </a>
            <a href="https://wa.me/5531987722422" target="_blank" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
              <WhatsApp size={20} />
            </a>
          </div>
        </div>

        {/* Coluna 2 (Contato) */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6 border-b border-amber-500/30 pb-2 inline-block">Contato</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-neutral-400">
              <MapPin className="text-amber-500 mt-1 shrink-0" size={18} />
              <span>Rua Santa Cruz, 95 <br />Minaslandia, Belo Horizonte/MG</span>
            </li>
            <li className="flex items-center gap-3 text-neutral-400">
              <Phone className="text-amber-500 shrink-0" size={18} />
              <span>(31) 98772-2422</span>
            </li>
            {/*<li className="flex items-center gap-3 text-neutral-400">
              <Mail className="text-amber-500 shrink-0" size={18} />
              <span>email@gmail.com</span>
            </li>*/}
          </ul>
        </div>

        {/* Coluna 3 (Formulário) */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6 border-b border-amber-500/30 pb-2 inline-block">Contate-nos</h3>
          <p className="text-neutral-400 mb-6 text-sm">
            Tem alguma dúvida ou quer fazer orçamento? Acesse nosso catálogo, selecione os itens desejados e nos envie uma mensagem!
          </p>
          
          <Link onClick={() => window.scrollTo(0, 0)} to="/itens" className="group w-full bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-between">
            <span className="group-hover:text-amber-500 transition-colors">Enviar Solicitação</span>
            <div className="bg-amber-500 text-black rounded-full p-1 group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight size={20} />
            </div>
          </Link>
        </div>

      </div>

      <div className="text-center text-neutral-600 text-sm border-t border-neutral-900 pt-8">
        &copy; 2025 Salão Jiré Festas e Eventos. Todos os direitos reservados.
      </div>
    </footer>
  );
}