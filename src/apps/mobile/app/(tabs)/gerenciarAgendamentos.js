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
  Platform,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase";
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function GerenciarAgendamentos() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [ordemAscendente, setOrdemAscendente] = useState(true);

  const [modoCriar, setModoCriar] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [mostrarSelecaoItens, setMostrarSelecaoItens] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [itens, setItens] = useState([]);
  const [clienteDono, setClienteDono] = useState(null);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date')
  const [campoEditando, setCampoEditando] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  const [imagensEvento, setImagensEvento] = useState([
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/301",
    "https://picsum.photos/200/302",
    "https://picsum.photos/200/303"
  ]);
  const [indiceImagemAtual, setIndiceImagemAtual] = useState(0);

  const [novoAgendamento, setNovoAgendamento] = useState({
    nomeEvento: "",
    dataInicio: "",
    dataFim: "",
    valorTotal: 0,
  });


  useEffect(() => {
    carregarTudo();
  }, []);

  // Toda vez que agendamentoEditando mudar, colocar o cliente correto
  useEffect(() => {
    async function setCliente() {
      if (agendamentoEditando != null) {
        setClienteDono(await FirebaseAPI.firestore.clientes.getCliente(agendamentoEditando.clienteId));
      }
    }
    setCliente();
  }, [agendamentoEditando])

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

  const resetStates = () => {
      setModoCriar(false);
      setModoEditar(false);
      setAgendamentoEditando(null);
      setClienteDono(null);
      setNovoAgendamento({ nomeEvento: "", dataInicio: "", dataFim: "", valorTotal: 0 });
      setItensSelecionados([]);
      carregarTudo();
  }

  const handleSalvar = async () => {
    if (!novoAgendamento.dataInicio || !novoAgendamento.dataFim) return Alert.alert("Preencha as datas");

    const valorPago = 0; 
    if (modoEditar)
      valorPago = parseFloat((parseFloat(agendamentoEditando.valorPago || 0) / 100).toFixed(2));
    
    setLoading(true);
    try {
      const payload = {
        nome: novoAgendamento.nomeEvento,
        dataInicio: new Date(novoAgendamento.dataInicio),
        dataFim: new Date(novoAgendamento.dataFim),
        valorTotal: novoAgendamento.valorTotal,
        itensAlugados: itensSelecionados,
        valorPago: valorPago,
        status: valorPago == 0 ? 'Não Pago' 
        : (valorPago == novoAgendamento.valorTotal) ? "Pago" : "Parcialmente Pago"
      };

      console.log(payload.valorPago);

      if (modoEditar && agendamentoEditando) {
        await FirebaseAPI.firestore.clientes.updateAgendamento(agendamentoEditando.clienteId, agendamentoEditando.id, payload);
      } else {
        if (!clienteDono) { setLoading(false); return Alert.alert("Selecione um cliente"); }
        await FirebaseAPI.firestore.clientes.addAgendamentoToCliente(clienteDono.id, payload);
      }
      resetStates();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (item) => {
    item.valorPago *= 100;
    setAgendamentoEditando(item);
    setModoEditar(true);
    setIndiceImagemAtual(0);

    const parseToISO = (val) => {
      if (!val) return "";
      if (val.seconds) return new Date(val.seconds * 1000).toISOString();
      return new Date(val).toISOString();
    };

    setNovoAgendamento({
      nomeEvento: item.nome || "",
      dataInicio: parseToISO(item.dataInicio),
      dataFim: parseToISO(item.dataFim),
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

    return ordemAscendente ? (secA - secB) : (secB - secA);
  });

  // CALENDÁRIO
  const formatarDataHora = (dataString) => {
    if (!dataString) return "Selecionar";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "Selecionar";

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} - ${hora}:${min}`;
  };

  function formatarValor(v) {
  const numero = (parseFloat(v || 0) / 100).toFixed(2);
  return "R$ " + numero.replace(".", ",");
  }

  const abrirCalendario = (campo) => {
    setCampoEditando(campo);
    const valorAtual = novoAgendamento[campo];
    const dataInicial = valorAtual ? new Date(valorAtual) : new Date();

    setTempDate(dataInicial);
    setPickerMode('date');
    setShowPicker(true);
  };

  const onChangePicker = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate || tempDate;

    if (pickerMode === 'date') {
      setShowPicker(Platform.OS === 'ios');
      setTempDate(currentDate);
      setPickerMode('time');
      if (Platform.OS === 'android') setShowPicker(true);
    } else {
      setShowPicker(false);
      const dataFinal = new Date(tempDate);
      dataFinal.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      dataFinal.setHours(currentDate.getHours());
      dataFinal.setMinutes(currentDate.getMinutes());

      setNovoAgendamento({
        ...novoAgendamento,
        [campoEditando]: dataFinal.toISOString()
      });
    }
  };
  
  const proximaImagem = () => {
    if (indiceImagemAtual < imagensEvento.length) {
      setIndiceImagemAtual(indiceImagemAtual + 1);
    } else {
      setIndiceImagemAtual(0);
    }
  };

  const anteriorImagem = () => {
    if (indiceImagemAtual > 0) {
      setIndiceImagemAtual(indiceImagemAtual - 1);
    } else {
      setIndiceImagemAtual(imagensEvento.length);
    }
  };

 // ------------RENDER------------

  if (modoCriar || modoEditar) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.headerTopo}>
          <TouchableOpacity onPress={() => {resetStates();}}>
            <Ionicons name="arrow-back" size={24} color="#F2C94C" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>{modoCriar ? "Criar agendamento" : "Visualizar agendamento"}</Text>
        </View>

        <View style={styles.contentBody}>

          {!modoCriar && (
            <>
              <View style={styles.cameraBox}>
                {indiceImagemAtual < imagensEvento.length ? (
                  <Image 
                    source={{ uri: imagensEvento[indiceImagemAtual] }} 
                    style={{ width: '100%', height: '100%', borderRadius: 30 }} 
                    resizeMode="cover"
                  />
                ) : (
                  <TouchableOpacity style={{alignItems:'center'}} onPress={() => Alert.alert("Em breve", "Funcionalidade de adicionar foto em breve.")}>
                    <Ionicons name="add-circle-outline" size={50} color="#000" />
                    <Text style={{fontWeight:'bold', marginTop: 5}}>Adicionar Foto</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.navPill}>
                <TouchableOpacity onPress={anteriorImagem}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, paddingHorizontal: 10 }}>{'<'}</Text>
                </TouchableOpacity>
                
                <View style={{ width: 40, alignItems:'center' }}>
                   <Text style={{ fontSize: 12, fontWeight:'bold' }}>
                     {indiceImagemAtual + 1} / {imagensEvento.length + 1}
                   </Text>
                </View>

                <TouchableOpacity onPress={proximaImagem}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, paddingHorizontal: 10 }}>{'>'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.rowTitle}>
            <TextInput
              style={styles.bigTitleInput}
              value={novoAgendamento.nomeEvento}
              placeholder="Nome do Evento"
              onChangeText={t => setNovoAgendamento({ ...novoAgendamento, nomeEvento: t })}
            />

            {!modoCriar && (
            <View style={
              (() => {
              switch (agendamentoEditando.status.toLowerCase()) {
                case 'pago': return styles.badgePago;
                case 'não pago': return styles.badgeNaoPago;
                case 'parcialmente pago': return styles.badgeParcialmentePago;
                default: return styles.badgeParcialmentePago;
              }
            })()}>
              <Text style={styles.badgeText}>{agendamentoEditando.status}</Text>
            </View>
            )}

          </View>

          <Text style={styles.labelSection}>Cliente:</Text>
          {!clienteDono ? (
            <ScrollView showsHorizontalScrollIndicator={false} >
              {clientes.map(c => (
                <TouchableOpacity key={c.id} onPress={() => setClienteDono(c)} style={styles.badgeClienteSelect}>
                  <Text style={{ color: '#fff' }}>{c.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.cardCliente}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {clienteDono?.nome ? clienteDono.nome.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
              <Text style={styles.clienteNome}>{clienteDono?.nome || "Selecione um cliente"}</Text>
              {modoCriar && <TouchableOpacity onPress={() => setClienteDono(null)}>
                <Ionicons name="pencil" size={20} color="#000" />
              </TouchableOpacity>}
            </View>
          )}

          <Text style={styles.labelSection}>Informações do aluguel:</Text>

          <View style={styles.inputRow}>
            <Text style={styles.labelInput}>Data de início:</Text>
            <TouchableOpacity
              style={styles.inputContainerRight}
              onPress={() => abrirCalendario('dataInicio')}
            >
              <Text style={styles.inputTextRight}>
                {formatarDataHora(novoAgendamento.dataInicio)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.labelInput}>Data de entrega:</Text>
            <TouchableOpacity
              style={styles.inputContainerRight}
              onPress={() => abrirCalendario('dataFim')}
            >
              <Text style={styles.inputTextRight}>
                {formatarDataHora(novoAgendamento.dataFim)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={tempDate}
              mode={pickerMode}
              is24Hour={true}
              display="default"
              onChange={onChangePicker}
            />
          )}

          {!modoCriar && (
          <View style={styles.inputRow}>
            <Text style={styles.labelInput}>Valor Pago:</Text>
            <View style={styles.inputContainerRight}>
              <TextInput 
              style={{ fontWeight: 'bold', textAlign: 'right'  }}
              value={formatarValor(agendamentoEditando.valorPago)}
              onChangeText={text => {
                const apenasNumeros = text.replace(/\D/g, "")
                setAgendamentoEditando(prev => ({...prev, valorPago: apenasNumeros}))
                
              }}
              />
            </View>
          </View>
          )}

          {!modoCriar && (
          <View style={styles.inputRow}>
            <Text style={styles.labelInput}>Valor Pendente:</Text>
            <View style={styles.inputContainerRight}>
              <Text style={{ fontWeight: 'bold' }}>
                {`R$ ${(agendamentoEditando.valorTotal - parseFloat(agendamentoEditando.valorPago || 0) / 100).toFixed(2)}`}
                </Text>
            </View>
          </View>
          )}

          <View style={styles.inputRow}>
            <Text style={styles.labelInput}>Valor Total:</Text>
            <View style={styles.inputContainerRight}>
              <Text style={{ fontWeight: 'bold' }}>R$ {novoAgendamento.valorTotal.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.labelSection}>Itens alugados:</Text>

          {itensSelecionados.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.iconBox}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name={item.nome.toLowerCase().includes('cadeira') ? "albums" : "cube"}
                    size={24} color="#000"
                  />
                )}
              </View>

              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemSub}>
                  {item.quantidade} unidades <Ionicons name="ellipse" size={6} color="#999" />  R${item.precoAluguel ? item.precoAluguel.toFixed(2) : "0.00"}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity><Ionicons name="pencil" size={20} color="#000" /></TouchableOpacity>
                <TouchableOpacity onPress={() => alternarItem(item)}>
                  <Ionicons name="trash-outline" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.btnAddItem}
            onPress={() => setMostrarSelecaoItens(!mostrarSelecaoItens)}
          >
            <Ionicons name="add" size={24} color="#000" />
            <Text style={styles.btnAddItemText}>Adicionar Item</Text>
          </TouchableOpacity>

          {mostrarSelecaoItens && (
            <View style={styles.listaSelecaoBox}>
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Toque para adicionar:</Text>
              {itens.length != itensSelecionados.length ? itens.map(item => {
                const selecionado = itensSelecionados.find(i => i.id === item.id);
                if (selecionado) return null;
                return (
                  <TouchableOpacity key={item.id} style={styles.itemSelectRow} onPress={() => alternarItem(item)}>
                    <Text>{item.nome} - R$ {item.precoAluguel}</Text>
                    <Ionicons name="add-circle-outline" size={24} color="#F2C94C" />
                  </TouchableOpacity>
                )
              }) : (<Text>Nenhum item disponivel para ser adicionado.</Text>)}
            </View>
          )}

          <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
            <Text style={styles.btnSalvarText}>Salvar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    );
  }

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
                <TouchableOpacity onPress={() => iniciarEdicao(item)}
                  style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

                  <View style={{ marginRight: 15 }}>
                    <Ionicons name="balloon" size={24} color="#000" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.nomeEvento}>{item.nome || "Evento"}</Text>
                    <Text style={styles.info}>
                      {inicio.toLocaleDateString()}  {inicio.getHours()}:{String(inicio.getMinutes()).padStart(2, '0')}-{fim.getHours()}:{String(fim.getMinutes()).padStart(2, '0')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginLeft: 10 }}>
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

  vazio: {
    color: "#999", textAlign: "center", marginTop: 30
  },

  headerTopo: {
    flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#000'
  },

  headerTitulo: {
    color: '#F2C94C', fontSize: 18, fontWeight: 'bold', marginLeft: 10
  },

  contentBody: {
    backgroundColor: '#F9F9F9', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, minHeight: 800
  },

  cameraBox: {
    alignSelf: 'center', width: 120, height: 120, borderRadius: 30, borderWidth: 2, borderColor: '#111', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginBottom: 10, marginTop: 10
  },

  navPill: {
    alignSelf: 'center', flexDirection: 'row', backgroundColor: '#F2C94C', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 20, marginBottom: 20
  },

  rowTitle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15
  },

  bigTitleInput: {
    fontSize: 22, fontWeight: 'bold', color: '#000', flex: 1
  },

  badgePago: {
    backgroundColor: '#27AE60', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12
  },

  badgeNaoPago: {
    backgroundColor: '#ca3c23ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12
  },

  badgeParcialmentePago: {
    backgroundColor: '#ca6623ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12
  },

  badgeText: {
    color: '#fff', fontWeight: 'bold', fontSize: 12
  },

  labelSection: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: '#000'
  },

  cardCliente: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 10
  },

  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2C94C', justifyContent: 'center', alignItems: 'center', marginRight: 10
  },

  avatarText: {
    fontWeight: 'bold', fontSize: 18
  },

  clienteNome: {
    flex: 1, fontWeight: '600', fontSize: 16
  },

  badgeClienteSelect: {
    backgroundColor: '#333', padding: 10, borderRadius: 20, marginRight: 10
  },

  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, justifyContent: 'space-between'
  },

  labelInput: {
    fontWeight: '600', fontSize: 14, color: '#333'
  },

  inputContainerRight: {
    flexDirection: 'row', alignItems: 'center', gap: 8
  },

  inputTextRight: {
    textAlign: 'right', minWidth: 100, color: '#333'
  },

  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee'
  },

  iconBox: {
    width: 40, alignItems: 'center'
  },

  itemTitle: {
    fontWeight: 'bold', fontSize: 15
  },

  itemSub: {
    color: '#777', fontSize: 12, marginTop: 2
  },

  btnAddItem: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEE', padding: 15, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#DDD', borderStyle: 'dashed'
  },

  btnAddItemText: {
    fontWeight: 'bold', fontSize: 16, marginLeft: 8
  },

  listaSelecaoBox: {
    backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#F2C94C'
  },

  itemSelectRow: {
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between'
  },

  btnSalvar: {
    backgroundColor: '#F2C94C', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30, marginBottom: 20
  },

  iconBox: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  btnSalvarText: {
    fontWeight: 'bold', fontSize: 18, color: '#000'
  }
});