import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type Cliente = {
  id: string;
  nome?: string;
};

type Agendamento = {
  id: string;
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

  const insets = useSafeAreaInsets();
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={22} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Gerenciar Agendamentos</Text>
      </View>

      {/* Campo de busca */}
      {!clienteSelecionado && (
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#FFD700" style={{ marginHorizontal: 6 }} />
          <TextInput
            placeholder="Pesquisar por cliente"
            placeholderTextColor="#999"
            style={styles.input}
            value={filtro}
            onChangeText={setFiltro}
          />
        </View>
      )}

      {/* Lista de clientes */}
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
              <Ionicons name="person-circle" size={28} color="#FFD700" />
              <Text style={styles.nomeCliente}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Lista de agendamentos */}
      {clienteSelecionado && !modoCriar && (
        <View style={styles.agendamentosBox}>
          <View style={styles.voltarBox}>
            <TouchableOpacity onPress={() => setClienteSelecionado(null)}>
              <Ionicons name="arrow-back" size={20} color="#FFD700" />
            </TouchableOpacity>
            <Text style={styles.nomeSelecionado}>{clienteSelecionado.nome}</Text>
          </View>

          <TouchableOpacity style={styles.botaoCriar} onPress={() => setModoCriar(true)}>
            <Ionicons name="add-circle" size={20} color="#000" />
            <Text style={styles.textoCriar}>Novo Agendamento</Text>
          </TouchableOpacity>

          <FlatList
            data={agendamentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
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

      {/* CRIAR NOVO AGENDAMENTO */}
      {modoCriar && (
        <ScrollView style={styles.formContainer}>
          <View style={styles.voltarBox}>
            <TouchableOpacity onPress={() => setModoCriar(false)}>
              <Ionicons name="arrow-back" size={20} color="#FFD700" />
            </TouchableOpacity>
            <Text style={styles.nomeSelecionado}>Novo Agendamento</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nome do evento"
            placeholderTextColor="#888"
            value={novoAgendamento.nomeEvento}
            onChangeText={(text) => setNovoAgendamento({ ...novoAgendamento, nomeEvento: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Data início (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={novoAgendamento.dataInicio}
            onChangeText={(text) => setNovoAgendamento({ ...novoAgendamento, dataInicio: text })}
          />

          <TextInput
            style={styles.input}
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
                  selecionado && { borderColor: "#FFD700", borderWidth: 1.5 },
                ]}
                onPress={() => alternarItem(item)}
              >
                <Ionicons name="cube" size={20} color="#FFD700" />
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemPreco}>R$ {item.precoAluguel?.toFixed(2)}</Text>
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

// ================== ESTILOS ==================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  titulo: { color: "#FFD700", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#111",
    color: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  clienteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  nomeCliente: { color: "#FFF", fontSize: 16, marginLeft: 10 },
  voltarBox: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  nomeSelecionado: { color: "#FFD700", fontWeight: "bold", marginLeft: 10, fontSize: 16 },
   agendamentosBox: {
    flex: 1,
    marginTop: 10,
  },
  card: { backgroundColor: "#111", padding: 12, borderRadius: 10, marginVertical: 6 },
  info: { color: "#DDD", fontSize: 14 },
  status: { color: "#FFD700", fontWeight: "600" },
  bold: { fontWeight: "bold" },
  vazio: { color: "#888", textAlign: "center", marginTop: 20 },
  subtitulo: { color: "#FFD700", fontWeight: "bold", marginVertical: 10 },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemNome: { color: "#FFF", flex: 1, marginLeft: 8 },
  itemPreco: { color: "#FFD700" },
  total: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    textAlign: "right",
  },
  botaoCriar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  textoCriar: { color: "#000", fontWeight: "bold", marginLeft: 6 },
  botaoCriarFinal: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotaoCriar: { color: "#000", fontWeight: "bold", textAlign: "center" },
  formContainer: { backgroundColor: "#000", padding: 10 },
});
