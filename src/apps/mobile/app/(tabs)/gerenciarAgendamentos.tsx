import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase";
import { useRouter } from "expo-router";

type Cliente = {
  id: string;
  nome?: string;
};

type Agendamento = {
  id: string;
  nome?: string; 
  status?: string;
  dataInicio?: { seconds: number };
  dataFim?: { seconds: number };
  valorTotal?: number;
    itensAlugados?: any[];

};

export default function GerenciarAgendamentos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modoCriar, setModoCriar] = useState(false);
const [modoEditar, setModoEditar] = useState(false);
const [agendamentoEditando, setAgendamentoEditando] = useState<Agendamento | null>(null);

  // Campos do novo agendamento
  const [itens, setItens] = useState<any[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<any[]>([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    nomeEvento: "",
    dataInicio: "",
    dataFim: "",
    valorTotal: 0,
  });

  // ========================
  // Funções de exclusão
  // ========================

// ========================
// Confirmar exclusão
// ========================
const confirmarExclusao = (agendamentoId: string) => {
  console.log(" confirmando exclusão para:", agendamentoId);

  Alert.alert(
    "Confirmar exclusão",
    "Tem certeza que deseja excluir este agendamento?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          console.log(" Pressionou EXCLUIR no alerta!");
          await excluirAgendamento(agendamentoId);
        },
      },
    ]
  );
};

// ========================
// Excluir agendamento
// ========================
const excluirAgendamento = async (agendamentoId: string) => {
  console.log(" Tentando excluir agendamento:", agendamentoId);

  if (!clienteSelecionado) {
    console.log(" Nenhum cliente selecionado!");
    return;
  }

  try {
    setLoading(true);

    if (!FirebaseAPI?.firestore?.clientes?.deleteAgendamento) {
      console.log(" deleteAgendamento NÃO encontrado no FirebaseAPI!");
      Alert.alert("Erro", "Função deleteAgendamento não existe no FirebaseAPI.");
      return;
    }
    
    await FirebaseAPI.firestore.clientes.deleteAgendamento(
      clienteSelecionado.id,
      agendamentoId
    );
    console.log("✅ Agendamento excluído do Firestore!");

    Alert.alert("Sucesso", "Agendamento excluído com sucesso!");
    carregarAgendamentos(clienteSelecionado.id);
  } catch (error) {
    console.error(" Erro real ao excluir agendamento:", error);
    Alert.alert("Erro", "Falha ao excluir agendamento. Veja o console.");
  } finally {
    setLoading(false);
  }
};

  const router = useRouter();

  // ========================
  // Carrega clientes
  // ========================
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const lista = await FirebaseAPI.firestore.clientes.getClientes();
      const listaFormatada = lista.map((c: any) => ({
        id: c.id,
        nome: c.nome || "Cliente sem nome",
      }));
      setClientes(listaFormatada);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      Alert.alert("Erro", "Falha ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  };

// ========================
// Carrega agendamentos
// ========================
const carregarAgendamentos = async (clienteId: string) => {
  try {
    setLoading(true);
    const lista = await FirebaseAPI.firestore.clientes.getAgendamentosFromCliente(clienteId);

    const listaFormatada = lista.map((a: any) => ({
      id: a.id,
      nome: a.nome || "Evento sem nome",
      status: a.status || "pendente",
      dataInicio: a.dataInicio,
      dataFim: a.dataFim,
      valorTotal: a.valorTotal,
      itensAlugados: a.itensAlugados || [], 
    }));

    setAgendamentos(listaFormatada);
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
    Alert.alert("Erro", "Falha ao carregar agendamentos.");
  } finally {
    setLoading(false);
  }
};

// ========================
// Inicia modo de edição
// ========================
const iniciarEdicao = (agendamento: Agendamento) => {
  setModoEditar(true);
  setAgendamentoEditando(agendamento);

  const parseData = (data: any) => {
    if (!data) return "";

    try {
      let dateObj;
      if (data.seconds) {
        dateObj = new Date(data.seconds * 1000);
      }
      else if (typeof data === "string") {
        dateObj = new Date(data);
      }
      else if (data instanceof Date) {
        dateObj = data;
      } else {
        return "";
      }

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (e) {
      console.warn("Erro ao formatar data:", e);
      return "";
    }
  };

  setNovoAgendamento({
    nomeEvento: agendamento.nome || "",
    dataInicio: parseData(agendamento.dataInicio),
    dataFim: parseData(agendamento.dataFim),
    valorTotal: agendamento.valorTotal || 0,
  });

  setItensSelecionados(agendamento.itensAlugados || []);
};

  // ========================
  // Carrega itens disponíveis
  // ========================
  const carregarItens = async () => {
    try {
      const lista = await FirebaseAPI.firestore.itens.getItens();
      setItens(lista);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    }
  };

  // ========================
  // Alternar seleção de item
  // ========================
  const alternarItem = (item: any) => {
    const existe = itensSelecionados.find((i) => i.id === item.id);
    if (existe) {
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
      setNovoAgendamento((prev) => ({
        ...prev,
        valorTotal: prev.valorTotal - item.precoAluguel,
      }));
    } else {
      setItensSelecionados([...itensSelecionados, item]);
      setNovoAgendamento((prev) => ({
        ...prev,
        valorTotal: prev.valorTotal + item.precoAluguel,
      }));
    }
  };

  // ========================
  // Criar novo agendamento
  // ========================
  const criarAgendamento = async () => {
    if (!clienteSelecionado) return;
    const { nomeEvento, dataInicio, dataFim, valorTotal } = novoAgendamento;

    if (!dataInicio || !dataFim || itensSelecionados.length === 0) {
      Alert.alert("Atenção", "Preencha todos os campos e selecione ao menos um item.");
      return;
    }

    try {
      setLoading(true);
      const novo = {
        nome: nomeEvento || `Evento de ${clienteSelecionado.nome}`,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        status: "agendado",
        valorTotal,
        itensAlugados: itensSelecionados,
        midias: [],
      };

      await FirebaseAPI.firestore.clientes.addAgendamentoToCliente(clienteSelecionado.id, novo);

      Alert.alert("Sucesso", "Agendamento criado com sucesso!");
      setModoCriar(false);
      setItensSelecionados([]);
      setNovoAgendamento({ nomeEvento: "", dataInicio: "", dataFim: "", valorTotal: 0 });
      carregarAgendamentos(clienteSelecionado.id);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      Alert.alert("Erro", "Falha ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  };

// ========================
// Editar agendamento existente
// ========================
const editarAgendamento = async () => {
  if (!clienteSelecionado || !agendamentoEditando) return;

  const { nomeEvento, dataInicio, dataFim, valorTotal } = novoAgendamento;

  if (!dataInicio || !dataFim) {
    Alert.alert("Atenção", "Preencha todas as datas antes de salvar.");
    return;
  }

  try {
    setLoading(true);
    await FirebaseAPI.firestore.clientes.updateAgendamento(
      clienteSelecionado.id,
      agendamentoEditando.id, 
      {
        nome: nomeEvento,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        valorTotal,
        itensAlugados: itensSelecionados, 
      }
    );

    Alert.alert("Sucesso", "Agendamento atualizado com sucesso!");
    setModoEditar(false);
    setAgendamentoEditando(null);
    carregarAgendamentos(clienteSelecionado.id);
  } catch (error) {
    console.error("Erro ao editar agendamento:", error);
    Alert.alert("Erro", "Falha ao editar agendamento.");
  } finally {
    setLoading(false);
  }
};

  // ========================
  // Filtro de clientes
  // ========================
  const clientesFiltrados = clientes.filter((c) =>
    c.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  // ========================
  // Render
  // ========================
  return (
    <View style={styles.container}>
      {/* --------- Cabeçalho --------- */}
      {!clienteSelecionado && (
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Ionicons name="arrow-back" size={22} color="#F2C94C" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Gerenciar Agendamentos</Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#F2C94C" style={{ marginHorizontal: 6 }} />
            <TextInput
              placeholder="Pesquisar por cliente"
              placeholderTextColor="#999"
              style={styles.inputSearch}
              value={filtro}
              onChangeText={setFiltro}
            />
          </View>
        </View>
      )}

      {/* --------- Lista de Clientes --------- */}
      {!loading && !clienteSelecionado && (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clienteItem}
              onPress={() => {
                setClienteSelecionado(item);
                carregarAgendamentos(item.id);
                carregarItens();
              }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.nome ? item.nome.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
              <Text style={styles.nomeCliente}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* --------- Agendamentos --------- */}
{clienteSelecionado && !modoCriar && !modoEditar && (
  <View style={styles.agendamentosBox}>
    <View style={styles.voltarBox}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => setClienteSelecionado(null)}>
          <Ionicons name="arrow-back" size={20} color="#F2C94C" />
        </TouchableOpacity>
        <Text style={styles.nomeSelecionado}>{clienteSelecionado.nome}</Text>
      </View>

      <TouchableOpacity style={styles.botaoCriar} onPress={() => setModoCriar(true)}>
        <Ionicons name="add-circle" size={18} color="#000" />
        <Text style={styles.textoCriar}>Novo Agendamento</Text>
      </TouchableOpacity>
    </View>

<FlatList
  data={agendamentos}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      {/* Nome do evento acima do status */}
      {item.nome && (
        <Text style={styles.nomeEvento}>{item.nome}</Text>
      )}

      <Text style={styles.status}>
        Status: <Text style={styles.bold}>{item.status}</Text>
      </Text>

      {item.dataInicio && (
        <Text style={styles.info}>
          Início: {new Date(item.dataInicio.seconds * 1000).toLocaleDateString()}
        </Text>
      )}
      {item.dataFim && (
        <Text style={styles.info}>
          Fim: {new Date(item.dataFim.seconds * 1000).toLocaleDateString()}
        </Text>
      )}
      {item.valorTotal && (
        <Text style={styles.info}>Valor: R$ {item.valorTotal.toFixed(2)}</Text>
      )}

{/* ---------- BOTÕES EDITAR E EXCLUIR ---------- */}
<View style={styles.botoesCard}>
  <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.iconeBotao}>
    <Ionicons name="create-outline" size={20} color="#111" /> 
  </TouchableOpacity>

  <TouchableOpacity onPress={() => confirmarExclusao(item.id)} style={styles.iconeBotaoExcluir}>
    <Ionicons name="trash-outline" size={20} color="#111" /> 
  </TouchableOpacity>
</View>


</View>
)}
ListEmptyComponent={<Text style={styles.vazio}>Nenhum agendamento encontrado.</Text>}
/>
</View>
)}

      {/* --------- Formulário de Agendamento (Novo ou Edição) --------- */}
{(modoCriar || modoEditar) && (
  <ScrollView style={styles.formContainer}>
 <View style={styles.voltarBoxNovo}>
      <TouchableOpacity
        onPress={() => {
          if (modoCriar) setModoCriar(false);
          if (modoEditar) {
            setModoEditar(false);
            setAgendamentoEditando(null);
          }
        }}
      >
        <Ionicons name="arrow-back" size={20} color="#F2C94C" />
      </TouchableOpacity>
      <Text style={styles.nomeSelecionado}>
        {modoEditar ? "Editar Agendamento" : "Novo Agendamento"}
      </Text>
    </View>

    {/* Nome do evento */}
    <TextInput
      style={styles.inputForm}
      placeholder="Nome do evento"
      placeholderTextColor="#888"
      value={novoAgendamento.nomeEvento}
      onChangeText={(text) =>
        setNovoAgendamento({ ...novoAgendamento, nomeEvento: text })
      }
    />

    {/* Datas */}
    <TextInput
      style={styles.inputForm}
      placeholder="Data início (YYYY-MM-DD)"
      placeholderTextColor="#888"
      value={novoAgendamento.dataInicio}
      onChangeText={(text) =>
        setNovoAgendamento({ ...novoAgendamento, dataInicio: text })
      }
    />

    <TextInput
      style={styles.inputForm}
      placeholder="Data fim (YYYY-MM-DD)"
      placeholderTextColor="#888"
      value={novoAgendamento.dataFim}
      onChangeText={(text) =>
        setNovoAgendamento({ ...novoAgendamento, dataFim: text })
      }
    />

    {/* Itens */}
    <Text style={styles.subtitulo}>Itens disponíveis:</Text>
    {itens.map((item) => {
      const selecionado = itensSelecionados.find((i) => i.id === item.id);
      return (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.itemCard,
            selecionado && {
              backgroundColor: "#F2C94C",
              borderColor: "#000",
              transform: [{ scale: 1.02 }],
            },
          ]}
          onPress={() => alternarItem(item)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="cube"
            size={20}
            color={selecionado ? "#000" : "#F2C94C"}
          />
          <Text
            style={[styles.itemNome, selecionado && { color: "#000" }]}
          >
            {item.nome}
          </Text>
          <Text
            style={[styles.itemPreco, selecionado && { color: "#000" }]}
          >
            R$ {item.precoAluguel?.toFixed(2)}
          </Text>
        </TouchableOpacity>
      );
    })}

    {/* Valor total */}
    <Text style={styles.total}>
      Valor Total: R$ {novoAgendamento.valorTotal.toFixed(2)}
    </Text>

    {/* Botão final */}
    <TouchableOpacity
      style={styles.botaoCriarFinal}
      onPress={modoEditar ? editarAgendamento : criarAgendamento}
    >
      <Text style={styles.textoBotaoCriar}>
        {modoEditar ? "Salvar Alterações" : "Criar"}
      </Text>
    </TouchableOpacity>
  </ScrollView>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
    paddingTop: 0, 
  },

headerWrapper: {
  backgroundColor: "#000",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  paddingTop: 40,        
  paddingBottom: 25,    
  paddingHorizontal: 20,
  elevation: 6,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
},

header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingTop: 10,        
},

  titulo: { color: "#F2C94C", fontSize: 20, fontWeight: "bold", marginLeft: 8 },

searchBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#1C1C1E",  
  borderRadius: 10,
  paddingHorizontal: 10,
  height: 45,
  marginTop: 10,        
  marginHorizontal: 15,  
},
  inputSearch: {
    backgroundColor: "#1C1C1E",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    flex: 1,
  },
  inputForm: {
    backgroundColor: "#F7F7F7",
    color: "#111",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#F2C94C",
  },

  clienteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2C94C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#111", fontWeight: "700" },
  nomeCliente: { color: "#111", fontWeight: "700" },

voltarBox: {
  backgroundColor: "#000",
  paddingTop: 45,
  paddingBottom: 25,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#F2C94C",
},

  nomeSelecionado: { color: "#F2C94C", fontWeight: "bold", fontSize: 18 },

  agendamentosBox: { flex: 1 },
card: {
  backgroundColor: "#fff",        
  borderRadius: 12,             
  padding: 16,
  marginVertical: 8,
  shadowColor: "#000",          
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,             
},

status: {
  color: "#111",
  fontWeight: "bold",
  marginBottom: 8,
  fontSize: 16,
  textTransform: "uppercase",
},

info: {
  color: "#333",
  fontSize: 14,
  marginBottom: 4,
  lineHeight: 20,
},

bold: {
  fontWeight: "bold",
  color: "#fff",
},

vazio: {
  color: "#999",
  textAlign: "center",
  marginTop: 20,
  fontStyle: "italic",
  fontSize: 14,
},

subtitulo: {
  color: "#F2C94C",
  fontWeight: "bold",
  marginVertical: 10,
  fontSize: 16,
  textTransform: "uppercase",
  letterSpacing: 0.5,
},

itemCard: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#111", 
  borderWidth: 1,
  borderColor: "#F2C94C",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 3,
},

itemNome: { color: "#F2C94C", flex: 1, marginLeft: 8, fontWeight: "600" },
itemPreco: { color: "#F2C94C", fontWeight: "700" },

total: {
  color: "#F2C94C",
  fontWeight: "bold",
  fontSize: 20,          
  marginTop: 14,
  textAlign: "right",
  letterSpacing: 0.5,  
  textShadowColor: "rgba(0, 0, 0, 0.2)", 
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},

botaoCriar: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F2C94C",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 30,
  marginTop: 12,            
  alignSelf: "flex-start",    
  shadowColor: "transparent",
  elevation: 0,
},

  textoCriar: { color: "#000", fontWeight: "bold", fontSize: 14, marginLeft: 6 },
  botaoCriarFinal: {
    backgroundColor: "#F2C94C",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotaoCriar: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },

nomeEvento: {
  color: "#F2C94C",
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
  textTransform: "capitalize",
},


botaoExcluir: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#c0392b",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 30,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},
textoExcluir: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
  marginLeft: 6,
},

botoesCard: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",  
  marginTop: 4,          
  position: "absolute", 
  right: 10,             
  top: 70,               
},


iconeBotao: {
  backgroundColor: "transparent", 
  padding: 6,
  borderRadius: 8,
},

iconeBotaoExcluir: {
  padding: 8,
  borderRadius: 8,
  backgroundColor: "transparent", 
},

  formContainer: {
  backgroundColor: "#fff",
  paddingHorizontal: 10,  
  paddingVertical: 5,     
  flexGrow: 1,
  transform: [{ scale: 1.0 }],
},

voltarBoxNovo: {
  backgroundColor: "#000",
  width: "107%", 
  paddingTop: 60,          
  paddingBottom: 30,      
  paddingHorizontal: 20,
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 8,
  marginTop: -10, 
  marginLeft: -10,
  alignSelf: "center", 
},
});
