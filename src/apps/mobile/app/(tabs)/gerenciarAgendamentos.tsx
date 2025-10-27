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
  const insets = useSafeAreaInsets();
  const router = useRouter(); 

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
        <Text style={styles.titulo}>Gerenciar agendamentos</Text>
      </View>

      {/* Campo de busca */}
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

      {/* Indicador de carregamento */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color="#FFD700" size="large" />
          <Text style={styles.loadingText}>Carregando...</Text>
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
              }}
            >
              <Ionicons name="person-circle" size={28} color="#FFD700" />
              <Text style={styles.nomeCliente}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Lista de agendamentos */}
      {clienteSelecionado && !loading && (
        <View style={styles.agendamentosBox}>
          <View style={styles.voltarBox}>
            <TouchableOpacity onPress={() => setClienteSelecionado(null)}>
              <Ionicons name="arrow-back" size={20} color="#FFD700" />
            </TouchableOpacity>
            <Text style={styles.nomeSelecionado}>{clienteSelecionado.nome}</Text>
          </View>

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
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum agendamento encontrado.</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

// ================== ESTILOS ==================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  titulo: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
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
    color: "#FFF",
    flex: 1,
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFD700",
    marginTop: 10,
  },
  clienteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  nomeCliente: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
  },
  agendamentosBox: {
    flex: 1,
  },
  voltarBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nomeSelecionado: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  info: {
    color: "#DDD",
    fontSize: 14,
    marginTop: 2,
  },
  status: {
    color: "#FFD700",
    fontWeight: "600",
  },
  bold: {
    fontWeight: "bold",
  },
  vazio: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
