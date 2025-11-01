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
};


export default function GerenciarAgendamentos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modoCriar, setModoCriar] = useState(false);

  // Campos do novo agendamento
  const [itens, setItens] = useState<any[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<any[]>([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    nomeEvento: "",
    dataInicio: "",
    dataFim: "",
    valorTotal: 0,
  });

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
{clienteSelecionado && !modoCriar && (
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
        </View>
      )}
      ListEmptyComponent={<Text style={styles.vazio}>Nenhum agendamento encontrado.</Text>}
    />
  </View>
)}


      {/* --------- Formulário de Novo Agendamento --------- */}
      {modoCriar && (
        <ScrollView style={styles.formContainer}>
          <View style={styles.voltarBox}>
            <TouchableOpacity onPress={() => setModoCriar(false)}>
              <Ionicons name="arrow-back" size={20} color="#F2C94C" />
            </TouchableOpacity>
            <Text style={styles.nomeSelecionado}>Novo Agendamento</Text>
          </View>

          <TextInput
            style={styles.inputForm}
            placeholder="Nome do evento"
            placeholderTextColor="#888"
            value={novoAgendamento.nomeEvento}
            onChangeText={(text) => setNovoAgendamento({ ...novoAgendamento, nomeEvento: text })}
          />

          <TextInput
            style={styles.inputForm}
            placeholder="Data início (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={novoAgendamento.dataInicio}
            onChangeText={(text) => setNovoAgendamento({ ...novoAgendamento, dataInicio: text })}
          />

          <TextInput
            style={styles.inputForm}
            placeholder="Data fim (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={novoAgendamento.dataFim}
            onChangeText={(text) => setNovoAgendamento({ ...novoAgendamento, dataFim: text })}
          />

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
        style={[
          styles.itemNome,
          selecionado && { color: "#000" }, 
        ]}
      >
        {item.nome}
      </Text>
      <Text
        style={[
          styles.itemPreco,
          selecionado && { color: "#000" }, 
        ]}
      >
        R$ {item.precoAluguel?.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
})}


          <Text style={styles.total}>
            Valor Total: R$ {novoAgendamento.valorTotal.toFixed(2)}
          </Text>

          <TouchableOpacity style={styles.botaoCriarFinal} onPress={criarAgendamento}>
            <Text style={styles.textoBotaoCriar}>Criar</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerWrapper: {
    backgroundColor: "#000",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  titulo: { color: "#F2C94C", fontSize: 20, fontWeight: "bold", marginLeft: 8 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 10,
    height: 45,
    marginTop: -8,
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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#111",
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginBottom: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#F2C94C",
},

  nomeSelecionado: { color: "#F2C94C", fontWeight: "bold", fontSize: 18 },

  agendamentosBox: { flex: 1 },
card: {
  backgroundColor: "#1a1a1a", 
  borderColor: "#F2C94C",
  borderWidth: 0.5,
  borderRadius: 14,
  padding: 16,
  marginVertical: 8,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 3,
},

status: {
  color: "#F2C94C",
  fontWeight: "bold",
  marginBottom: 8,
  fontSize: 16,
  textTransform: "uppercase",
},

info: {
  color: "#EEE",
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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


  formContainer: { backgroundColor: "#fff", padding: 10 },
});
