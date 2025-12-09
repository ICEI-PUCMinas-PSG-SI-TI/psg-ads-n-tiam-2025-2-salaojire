import React, { useState } from 'react';
import { Phone, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import FirebaseAPI from "@packages/firebase";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        if (!formData.email || !formData.senha || (!isLogin && (!formData.nome || !formData.telefone))) {
            setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
            setIsLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setErrorMessage("Por favor, insira um e-mail válido.");
            setIsLoading(false);
            return;
        }

        if (!isLogin && formData.telefone.length < 10) {
            setErrorMessage("Por favor, insira um telefone válido com DDD.");
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await FirebaseAPI.auth.signIn(formData.email, formData.senha)
            } else {
                await FirebaseAPI.auth.signUpCliente({
                    email: formData.email,
                    senha: formData.senha,
                    nome: formData.nome,
                    telefone: formData.telefone
                })
            }

            navigate('/perfil');
        } catch (error) {
            let message = error.message;
            message = message.replace("auth/email-already-in-use", "Email já está em uso");

            setErrorMessage(`Ocorreu um erro ao tentar entrar: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center justify-center">
            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 w-full max-w-md shadow-2xl">

                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {isLogin ? 'Acesse sua área do cliente' : 'Preencha os dados para se cadastrar'}
                    </p>
                </div>

                {/* Exibição de Erro */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 animate-fade-in">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <span className="text-sm">{errorMessage}</span>
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Campos do Cadastro */}
                    {!isLogin && (
                        <>
                            {/* Nome */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-300 ml-1">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Digite seu nome..."
                                        className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                                    />
                                </div>
                            </div>

                            {/* Telefone */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-300 ml-1">
                                    Telefone / WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                                    <input
                                        type="tel"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(00) 90000-0000"
                                        className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-300 ml-1">
                            E-mail
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemplo@email.com"
                                className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-300 ml-1">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-neutral-500" size={20} />
                            <input
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                placeholder="Digite sua senha..."
                                className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-12 text-white outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    {/* Enviar */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Carregando...</span>
                        ) : (
                            <>
                                {isLogin ? 'Entrar' : 'Cadastrar'} <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Alternação entre login e cadastro */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMessage('');
                            setFormData({ nome: '', telefone: '', email: '', senha: '' });
                        }}
                        className="text-neutral-400 hover:text-amber-500 text-sm underline transition-colors"
                    >
                        {isLogin ? 'Não tem conta? Crie agora' : 'Já tem conta? Faça login'}
                    </button>
                </div>
            </div>
        </div>
    );
}