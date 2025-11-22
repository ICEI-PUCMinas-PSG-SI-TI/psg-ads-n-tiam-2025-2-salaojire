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

export default function GerenciarAgendamentos() {
  const router = useRouter();

  // Estados Principais
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Estado para controlar a ordenação
  const [ordemAscendente, setOrdemAscendente] = useState(true);

  // Estados de Edição/Criação
  const [modoCriar, setModoCriar] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);

  // Dados auxiliares
  const [clientes, setClientes] = useState([]);
  const [itens, setItens] = useState([]);
  const [clienteDono, setClienteDono] = useState(null);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const [novoAgendamento, setNovoAgendamento] = useState({
    nomeEvento: "",
    dataInicio: "",
    dataFim: "",
    valorTotal: 0,
  });

  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const listaAgendamentos = await FirebaseAPI.firestore.clientes.getAllAgendamentos();
      setAgendamentos(listaAgendamentos);

      const listaClientes = await FirebaseAPI.firestore.clientes.getClientes();
      setClientes(listaClientes);
      const listaItens = await FirebaseAPI.firestore.itens.getItens();
      setItens(listaItens);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (agendamento) => {
    Alert.alert("Confirmar exclusão", "Deseja excluir este agendamento?", [
      { text: "Cancelar" },
      {
        text: "Excluir", style: "destructive", onPress: async () => {
          if (!agendamento.clienteId) return;
          await FirebaseAPI.firestore.clientes.deleteAgendamento(agendamento.clienteId, agendamento.id);
          carregarTudo();
        }
      }
    ]);
  };

  const handleSalvar = async () => {
    if (!novoAgendamento.dataInicio || !novoAgendamento.dataFim) return Alert.alert("Preencha as datas");

    setLoading(true);
    try {
      const payload = {
        nome: novoAgendamento.nomeEvento,
        dataInicio: new Date(novoAgendamento.dataInicio),
        dataFim: new Date(novoAgendamento.dataFim),
        valorTotal: novoAgendamento.valorTotal,
        itensAlugados: itensSelecionados,
        status: "agendado"
      };

      if (modoEditar && agendamentoEditando) {
        await FirebaseAPI.firestore.clientes.updateAgendamento(agendamentoEditando.clienteId, agendamentoEditando.id, payload);
      } else {
        if (!clienteDono) { setLoading(false); return Alert.alert("Selecione um cliente"); }
        await FirebaseAPI.firestore.clientes.addAgendamentoToCliente(clienteDono.id, payload);
      }
      setModoCriar(false);
      setModoEditar(false);
      setAgendamentoEditando(null);
      setClienteDono(null);
      setNovoAgendamento({ nomeEvento: "", dataInicio: "", dataFim: "", valorTotal: 0 });
      setItensSelecionados([]);
      carregarTudo();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (item) => {
    setAgendamentoEditando(item);
    setModoEditar(true);
    const isoDate = (s) => s ? new Date(s * 1000).toISOString().split('T')[0] : "";

    setNovoAgendamento({
      nomeEvento: item.nome || "",
      dataInicio: item.dataInicio ? isoDate(item.dataInicio.seconds) : "",
      dataFim: item.dataFim ? isoDate(item.dataFim.seconds) : "",
      valorTotal: item.valorTotal || 0
    });
    setItensSelecionados(item.itensAlugados || []);
  };

  const alternarItem = (item) => {
    const existe = itensSelecionados.find((i) => i.id === item.id);
    if (existe) {
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
      setNovoAgendamento(prev => ({ ...prev, valorTotal: prev.valorTotal - item.precoAluguel }));
    } else {
      setItensSelecionados([...itensSelecionados, item]);
      setNovoAgendamento(prev => ({ ...prev, valorTotal: prev.valorTotal + item.precoAluguel }));
    }
  };

  const filtrados = agendamentos.filter(a =>
    a.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const listaFinal = filtrados.sort((a, b) => {
    const secA = a.dataInicio?.seconds || 0;
    const secB = b.dataInicio?.seconds || 0;

    if (secA < 0) return 1;
    if (secB < 0) return -1;

    return ordemAscendente ? (secA - secB) : (secB - secA); // Ordena os agendamentos
  });


  // ================= RENDER =================

  if (modoCriar || modoEditar) {
    return (
      <ScrollView style={styles.formContainer}>
        <View style={styles.voltarBoxNovo}>
          <TouchableOpacity onPress={() => { setModoCriar(false); setModoEditar(false); }}>
            <Ionicons name="arrow-back" size={24} color="#F2C94C" />
          </TouchableOpacity>
          <Text style={styles.nomeSelecionado}>{modoEditar ? "Editar" : "Novo Agendamento"}</Text>
        </View>

        {modoCriar && (
          <View style={{ marginVertical: 15 }}>
            <Text style={styles.subtitulo}>Selecione o Cliente:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {clientes.map(c => (
                <TouchableOpacity key={c.id}
                  style={[styles.botaoCriar, { marginRight: 10, backgroundColor: clienteDono?.id === c.id ? '#F2C94C' : '#333' }]}
                  onPress={() => setClienteDono(c)}>
                  <Text style={[styles.textoCriar, { color: clienteDono?.id === c.id ? '#000' : '#fff', marginLeft: 0 }]}>{c.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TextInput style={styles.inputForm} placeholder="Nome do Evento" value={novoAgendamento.nomeEvento} onChangeText={t => setNovoAgendamento({ ...novoAgendamento, nomeEvento: t })} />
        <TextInput style={styles.inputForm} placeholder="Início (YYYY-MM-DD)" value={novoAgendamento.dataInicio} onChangeText={t => setNovoAgendamento({ ...novoAgendamento, dataInicio: t })} />
        <TextInput style={styles.inputForm} placeholder="Fim (YYYY-MM-DD)" value={novoAgendamento.dataFim} onChangeText={t => setNovoAgendamento({ ...novoAgendamento, dataFim: t })} />

        <Text style={styles.subtitulo}>Itens:</Text>
        {itens.map(item => {
          const sel = itensSelecionados.find(i => i.id === item.id);
          return (
            <TouchableOpacity key={item.id} style={[styles.itemCard, sel && { backgroundColor: '#F2C94C' }]} onPress={() => alternarItem(item)}>
              <Text style={[styles.itemNome, sel && { color: '#000' }]}>{item.nome}</Text>
              <Text style={[styles.itemPreco, sel && { color: '#000' }]}>R$ {item.precoAluguel}</Text>
            </TouchableOpacity>
          )
        })}
        <Text style={styles.total}>Total: R$ {novoAgendamento.valorTotal.toFixed(2)}</Text>
        <TouchableOpacity style={styles.botaoCriarFinal} onPress={handleSalvar}>
          <Text style={styles.textoBotaoCriar}>Salvar</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  }

  // TELA PRINCIPAL
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#F2C94C" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Agendamentos</Text>
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setModoCriar(true)}>
            <Text style={{ color: '#F2C94C' }}>+ Adicionar novo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#F2C94C" />
          <TextInput
            style={styles.inputSearch}
            placeholder="Pesquisar solicitação"
            placeholderTextColor="#999"
            value={filtro}
            onChangeText={setFiltro}
          />
        </View>
      </View>

      <View style={styles.agendamentosBox}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => setOrdemAscendente(!ordemAscendente)}>
            <Text style={{ color: '#F2C94C', fontWeight: 'bold' }}>
              {ordemAscendente ? "Mais recentes ▼" : "Mais distantes ▲"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={listaFinal}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
          renderItem={({ item }) => {
            const inicio = item.dataInicio ? new Date(item.dataInicio.seconds * 1000) : new Date();
            const fim = item.dataFim ? new Date(item.dataFim.seconds * 1000) : new Date();

            return (
              <View style={styles.card}>
                <View style={{ marginRight: 15 }}>
                  <Ionicons name="balloon" size={24} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nomeEvento}>{item.nome || "Evento"}</Text>
                  <Text style={styles.info}>
                    {inicio.toLocaleDateString()}  {inicio.getHours()}:{String(inicio.getMinutes()).padStart(2, '0')}-{fim.getHours()}:{String(fim.getMinutes()).padStart(2, '0')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => iniciarEdicao(item)}>
                    <Ionicons name="eye" size={24} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarExclusao(item)} style={{ marginTop: 10 }}>
                    <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum agendamento.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#000", paddingTop: 0
  },

  headerWrapper: {
    backgroundColor: "#000", paddingTop: 40, paddingBottom: 15, paddingHorizontal: 0
  },

  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, marginBottom: 15
  },

  titulo: {
    color: "#F2C94C", fontSize: 20, fontWeight: "bold", marginLeft: 15
  },

  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1C1C1E", borderRadius: 12, paddingHorizontal: 15, height: 50, marginHorizontal: 20
  },

  inputSearch: {
    color: "#fff", flex: 1, marginLeft: 10, fontSize: 15
  },

  agendamentosBox: {
    flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 10
  },
  
  card: {
    backgroundColor: "#EAE2D6", borderRadius: 25, paddingVertical: 15, paddingHorizontal: 20, marginVertical: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between"
  },

  nomeEvento: {
    color: "#111", fontSize: 16, fontWeight: "500", marginBottom: 2
  },

  info: {
    color: "#555", fontSize: 14
  },

  formContainer: {
    backgroundColor: "#fff", flex: 1
  },

  voltarBoxNovo: {
    backgroundColor: "#000", paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 10
  },

  nomeSelecionado: {
    color: "#F2C94C", fontWeight: "bold", fontSize: 18
  },
  
  inputForm: {
    backgroundColor: "#F7F7F7", color: "#111", borderRadius: 8, padding: 12, fontSize: 14, marginVertical: 8, marginHorizontal: 10, borderWidth: 1, borderColor: "#ddd"
  },

  subtitulo: {
    color: "#F2C94C", fontWeight: "bold", marginVertical: 10, marginHorizontal: 10, fontSize: 16
  },

  itemCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111", borderWidth: 1, borderColor: "#F2C94C", padding: 12, borderRadius: 12, marginBottom: 10, marginHorizontal: 10
  },

  itemNome: {
    color: "#F2C94C", flex: 1, fontWeight: "600"
  },

  itemPreco: {
    color: "#F2C94C", fontWeight: "700"
  },

  botaoCriar: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 30, alignItems: 'center', justifyContent: 'center'
  },

  textoCriar: {
    fontWeight: "bold", fontSize: 14
  },

  botaoCriarFinal: {
    backgroundColor: "#F2C94C", padding: 15, borderRadius: 10, marginTop: 20, marginHorizontal: 10
  },

  textoBotaoCriar: {
    color: "#000", fontWeight: "bold", textAlign: "center", fontSize: 16
  },

  total: {
    color: "#000", fontWeight: "bold", fontSize: 20, marginTop: 14, marginRight: 10, textAlign: "right"
  },

  vazio: {
    color: "#999", textAlign: "center", marginTop: 30
  },
});