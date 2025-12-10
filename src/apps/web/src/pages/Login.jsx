import React, { useState } from 'react';
import { Phone, User, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import FirebaseAPI from "@packages/firebase";

export default function Login() {
    // View pode ser 'login' | 'register' | 'recover'
    const [view, setView] = useState('login');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (status.message) setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        // Validações básicas
        if (view === 'login') {
            if (!formData.email || !formData.senha) {
                setStatus({ type: 'error', message: "Por favor, preencha e-mail e senha." });
                setIsLoading(false);
                return;
            }
        } else if (view === 'register') {
            if (!formData.nome || !formData.telefone || !formData.email || !formData.senha) {
                setStatus({ type: 'error', message: "Por favor, preencha todos os campos." });
                setIsLoading(false);
                return;
            }
            if (formData.telefone.length < 10) {
                setStatus({ type: 'error', message: "Telefone inválido (mínimo 10 dígitos)." });
                setIsLoading(false);
                return;
            }
        }

        try {
            if (view === 'login') {
                await FirebaseAPI.auth.signIn(formData.email, formData.senha);
            } else {
                await FirebaseAPI.auth.signUpCliente({
                    email: formData.email,
                    senha: formData.senha,
                    nome: formData.nome,
                    telefone: formData.telefone
                });
            }
            navigate('/perfil');
        } catch (error) {
            let message = error.message;
            if (message.includes("auth/email-already-in-use")) message = "Este e-mail já está em uso.";
            if (message.includes("auth/invalid-credential")) message = "E-mail ou senha incorretos.";
            if (message.includes("auth/user-not-found")) message = "Usuário não encontrado.";
            if (message.includes("auth/wrong-password")) message = "Senha incorreta.";

            setStatus({ type: 'error', message: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            setStatus({ type: 'error', message: "Digite seu e-mail para recuperar a senha." });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await FirebaseAPI.auth.sendResetEmail(formData.email);
            setStatus({
                type: 'success',
                message: `Email enviado! Verifique a caixa de entrada de ${formData.email} para redefinir sua senha.`
            });
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Erro ao enviar email." });
        } finally {
            setIsLoading(false);
        }
    };

    const getHeaderContent = () => {
        switch (view) {
            case 'register':
                return { title: 'Crie sua conta', subtitle: 'Preencha os dados para se cadastrar' };
            case 'recover':
                return { title: 'Recuperar Senha', subtitle: 'Enviaremos um link para o seu e-mail' };
            default:
                return { title: 'Bem-vindo de volta', subtitle: 'Acesse sua área do cliente' };
        }
    };

    const header = getHeaderContent();

    return (
        <div className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center justify-center">
            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 w-full max-w-md shadow-2xl transition-all duration-500">

                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">
                        {header.title}
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {header.subtitle}
                    </p>
                </div>

                {/* Mensagens de Erro ou Sucesso */}
                {status.message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 animate-fade-in border ${status.type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {status.type === 'success' ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                        <span className="text-sm">{status.message}</span>
                    </div>
                )}

                {/* Se o email de recuperação foi enviado com sucesso, mostra botão de voltar apenas */}
                {view === 'recover' && status.type === 'success' ? (
                    <div className="mt-6">
                        <button
                            onClick={() => { setView('login'); setStatus({ type: '', message: '' }); }}
                            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-lg transition-all"
                        >
                            Voltar para o Login
                        </button>
                    </div>
                ) : (
                    /* Formulário Principal */
                    <form onSubmit={view === 'recover' ? handleResetPassword : handleSubmit} className="space-y-5">

                        {view === 'register' && (
                            <>
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-sm font-bold text-neutral-300 ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            placeholder="Digite seu nome..."
                                            className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-sm font-bold text-neutral-300 ml-1">Telefone / WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                                        <input
                                            type="tel"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            placeholder="(00) 90000-0000"
                                            className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300 ml-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemplo@email.com"
                                    className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                        </div>

                        {view !== 'recover' && (
                            <div className="space-y-2 animate-fade-in">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-neutral-300">Senha</label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => { setView('recover'); setStatus({ type: '', message: '' }); }}
                                            className="text-xs text-amber-500 hover:text-amber-400 hover:underline"
                                        >
                                            Esqueceu a senha?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                                    <input
                                        type="password"
                                        name="senha"
                                        value={formData.senha}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha..."
                                        className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-amber-900/20"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Processando...</span>
                            ) : (
                                <>
                                    {view === 'login' && (<>Entrar <ArrowRight size={20} /></>)}
                                    {view === 'register' && (<>Cadastrar <ArrowRight size={20} /></>)}
                                    {view === 'recover' && 'Enviar Email de Recuperação'}
                                </>
                            )}
                        </button>

                        {view === 'recover' && (
                            <button
                                type="button"
                                onClick={() => { setView('login'); setStatus({ type: '', message: '' }); }}
                                className="w-full text-neutral-400 hover:text-white text-sm py-2 flex items-center justify-center gap-2 transition-colors"
                            >
                                <ArrowLeft size={16} /> Voltar para o Login
                            </button>
                        )}
                    </form>
                )}

                {/* Alternador entre Login e Cadastro */}
                {view !== 'recover' && (
                    <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                        <p className="text-neutral-500 text-sm mb-3">
                            {view === 'login' ? 'Ainda não tem uma conta?' : 'Já possui cadastro?'}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setView(view === 'login' ? 'register' : 'login');
                                setStatus({ type: '', message: '' });
                                setFormData(prev => ({ ...prev, nome: '', telefone: '', senha: '' }));
                            }}
                            className="text-amber-500 hover:text-amber-400 font-bold text-sm tracking-wide border border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 px-6 py-2 rounded-full transition-all"
                        >
                            {view === 'login' ? 'CRIAR NOVA CONTA' : 'FAZER LOGIN'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}