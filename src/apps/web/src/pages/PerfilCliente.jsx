import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import FirebaseAPI from "@packages/firebase";
import { useAuth } from "../contexts/AuthContext";

function formatarData(value) {
    if (!value) return "-";


    if (value?.toDate) {
        return value.toDate().toLocaleDateString();
    }


    const d = new Date(value);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString();
}

function formatarDataHora(value) {
    if (!value) return "-";

    const d = value?.toDate ? value.toDate() : new Date(value);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString() + " às " + d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


export default function PerfilCliente() {
    const navigate = useNavigate();
    const { signed, user, loading } = useAuth();

    const [agendamentos, setAgendamentos] = useState([]);

    // Quando o cliente do contexto mudar, buscamos os agendamentos
    useEffect(() => {
        if (!user) return;

        async function carregarAgendamentos() {
            const historico = await FirebaseAPI.firestore.clientes.getAgendamentosFromCliente(user.id);
            setAgendamentos(historico);
        }

        carregarAgendamentos();
    }, [user]);

    // Ainda carregando autenticação?
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Carregando perfil...
            </div>
        );
    }

    // Nenhum usuário logado /redirecionar
    if (!signed) {
        navigate("/login");
        return null;
    }

    // Usuário existe, mas cliente do Firestore não carregou
    if (!signed) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Erro ao carregar dados do cliente. Tente entrar novamente.
            </div>
        );
    }

    const cliente = user;

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">

            {/* Voltar */}
            <button
                onClick={() => navigate("/")}
                className="text-neutral-400 hover:text-amber-500 flex items-center gap-2 mb-6"
            >
                <ArrowLeft size={20} /> Voltar
            </button>

            <h1 className="text-3xl font-serif mb-6">Área do Cliente</h1>

            {/* Dados do Cliente */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-10">
                <h2 className="text-xl font-bold mb-4 text-amber-500">Seus Dados</h2>

                <div className="space-y-4">

                    <div className="flex items-center gap-3">
                        <User size={22} className="text-amber-500" />
                        <span>{cliente.nome}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Mail size={22} className="text-amber-500" />
                        <span>{cliente.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone size={22} className="text-amber-500" />
                        <span>{cliente.telefone}</span>
                    </div>

                </div>
            </div>

            {/* Histórico */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-amber-500 mb-4">Histórico de Agendamentos</h2>

                {agendamentos.length === 0 ? (
                    <p className="text-neutral-500">Nenhum agendamento encontrado.</p>
                ) : (
                    <div className="space-y-4">
                        {agendamentos.map((ag) => (
                            <div
                                key={ag.id}
                                className="border border-neutral-800 rounded-lg p-4 hover:border-amber-500 transition"
                            >
                                {/* Nome do evento */}
                                <h3 className="text-lg font-bold text-white">
                                    {ag.nomeEvento || ag.nome || "Evento"}
                                </h3>

                                {/* Datas */}
                                <p className="text-neutral-300 text-sm">
                                    Início:{" "}
                                    <span className="text-white">
                                        {formatarDataHora(ag.dataInicio)}
                                    </span>
                                </p>

                                <p className="text-neutral-300 text-sm">
                                    Fim:{" "}
                                    <span className="text-white">
                                        {formatarDataHora(ag.dataFim)}
                                    </span>
                                </p>

                                {/* Status */}
                                <p className="text-neutral-300 text-sm mt-1">
                                    Status:{" "}
                                    <span className="text-amber-500">
                                        {ag.status || "pendente"}
                                    </span>
                                </p>

                                {/* Itens alugados */}
                                {ag.itensAlugados?.length > 0 && (
                                    <div className="mt-3">
                                        <p className="font-bold text-neutral-200">Itens:</p>

                                        <ul className="list-disc ml-5 text-neutral-400 text-sm">
                                            {ag.itensAlugados.map((item) => (
                                                <li key={item.id}>
                                                    {item.nome} — {item.quantidade || 1} un.
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
