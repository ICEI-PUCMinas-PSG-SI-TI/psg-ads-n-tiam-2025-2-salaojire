import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import FirebaseAPI from "@packages/firebase";
import ItemGraficoBarra from "../../components/ItemGraficoBarra";
import { gerarRelatorioPDF } from "../../services/RelatorioPDF";

export default function Relatorios() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState([]);

  const [dataInicio, setDataInicio] = useState(new Date(2025, 0, 1));
  const [dataFim, setDataFim] = useState(new Date(2026, 0, 5));

  const [showPicker, setShowPicker] = useState(false);
  const [activeDateInput, setActiveDateInput] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const agendamentosFiltrados = useMemo(() => {
    const filtrados = agendamentos.filter((x) => {
      const dataX = new Date(x.dataFim.seconds * 1000);
      return dataX >= dataInicio.getTime() && dataX <= dataFim.getTime();
    });

    const ordenados = filtrados.sort((a, b) => {
      const secA = a.dataInicio?.seconds || 0;
      const secB = b.dataInicio?.seconds || 0;

      if (secA < 0) return 1;
      if (secB < 0) return -1;

      return secA - secB;
    });

    return ordenados;
  }, [agendamentos, dataInicio, dataFim])

  const dadosGerais = useMemo(() => {
    let somaFaturado = 0;
    let somaPendente = 0;
    let somaItens = 0;
    let diaMaisRentavelFaturado = 0;
    let diaMaisRentavelData = null;
    let dadosItens = {}

    agendamentosFiltrados.forEach((x) => {
      somaFaturado += x.valorPago || 0;
      somaPendente += x.valorTotal - (x.valorPago || 0)

      if (x.valorPago > diaMaisRentavelFaturado) {
        diaMaisRentavelFaturado = x.valorPago
        diaMaisRentavelData = x.dataFim.seconds
      }
      let horasAlugadas = (x.dataFim.seconds - x.dataInicio.seconds) / 60 / 60;

      x.itensAlugados.forEach((item) => {
        somaItens += item.quantidade;

        if (!dadosItens[item.nome]) {
          dadosItens[item.nome] = {
            nome: item.nome,
            totalQuantidade: 0,
            totalHorasAlugadas: 0,
            totalEventos: 0,
            imageUrl: item.imageUrl,
            precoAluguel: item.precoAluguel
          }
        }

        dadosItens[item.nome].totalQuantidade += item.quantidade
        dadosItens[item.nome].totalHorasAlugadas += Math.round(horasAlugadas * 10) / 10;
        dadosItens[item.nome].totalEventos += 1;
      })
    })

    const arrayDadosItens = Object.values(dadosItens).map(item => ({
      ...item,
      mediaPorEvento: Math.round((item.totalQuantidade / item.totalEventos) * 10) / 10,
      totalFaturado: (item.totalQuantidade * item.precoAluguel).toFixed(2)
    }))

    return {
      faturado: somaFaturado,
      pendente: somaPendente,
      agendamentos: agendamentosFiltrados.length || 0,
      itens: somaItens,
      medio: somaFaturado / (agendamentosFiltrados?.length || 1),
      diaRentavel: diaMaisRentavelData ? formatarData(new Date(diaMaisRentavelData * 1000)) : "Nenhum",
      diaRentavelFaturado: diaMaisRentavelFaturado,
      dadosItens: arrayDadosItens || []
    };
  }, [agendamentosFiltrados]);

  // Toda vez que colocar o foco na página, recarregar o relatório
  useFocusEffect(
    useCallback(() => {
      carregarTudo();
    }, [])
  )

  const carregarTudo = async () => {
    try {
      let listaAgendamentos = await FirebaseAPI.firestore.clientes.getAllAgendamentos();
      setAgendamentos(listaAgendamentos);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados.");
      console.error(error);
    }
  };

  const abrirCalendario = (campo) => {
    setActiveDateInput(campo);
    setTempDate(campo === 'inicio' ? dataInicio : dataFim);
    setShowPicker(true);
  };

  const onChangePicker = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || tempDate;
    setShowPicker(Platform.OS === 'ios');

    if (activeDateInput === 'inicio') setDataInicio(currentDate);
    else setDataFim(currentDate);

    if (Platform.OS !== 'ios') setShowPicker(false);
    carregarTudo();
  };

  const exportarPDF = async () => {
  try {
    await gerarRelatorioPDF(
      dadosGerais, 
      agendamentosFiltrados, 
      dataInicio, 
      dataFim
    );
  } catch (error) {
    Alert.alert("Erro", "Não foi possível gerar o PDF.");
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#F2C94C" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Relatórios</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Filtro do Periodo */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Período:</Text>

          <TouchableOpacity style={styles.dateButton} onPress={() => abrirCalendario('inicio')}>
            <Text style={styles.dateText}>{formatarData(dataInicio)}</Text>
            <Ionicons name="calendar" size={16} color="#000" />
          </TouchableOpacity>

          <Text style={styles.filterLabel}>a</Text>

          <TouchableOpacity style={styles.dateButton} onPress={() => abrirCalendario('fim')}>
            <Text style={styles.dateText}>{formatarData(dataFim)}</Text>
            <Ionicons name="calendar" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={onChangePicker}
          />
        )}

        {/* Botão Exportar */}
        <TouchableOpacity style={styles.exportButton} onPress={exportarPDF}>
          <Text style={styles.exportText}>Exportar relatório</Text>
          <Ionicons name="download-outline" size={18} color="#000" style={{ marginLeft: 5 }} />
          <View style={styles.pdfBadge}>
            <Text style={styles.pdfBadgeText}>pdf</Text>
            <Ionicons name="chevron-down" size={10} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Dados Coletados */}
        <View style={styles.cardWhite}>
          <Text style={styles.sectionTitle}>Dados Coletados</Text>

          <InfoRow label="Total Faturado:" value={`R$ ${dadosGerais.faturado.toFixed(2)}`} bold />
          <InfoRow label="Total Pendente:" value={`R$ ${dadosGerais.pendente.toFixed(2)}`} />
          <InfoRow label="Agendamentos realizados:" value={dadosGerais.agendamentos} centered />
          <InfoRow label="Itens alugados:" value={dadosGerais.itens} centered />
          <InfoRow label="R$ Medio por agendamento:" value={`R$ ${dadosGerais.medio.toFixed(2)}`} centered />
          <InfoRow label="Dia mais rentável:" value={`R$ ${dadosGerais.diaRentavelFaturado.toFixed(2)} - ${dadosGerais.diaRentavel}`} icon="calendar" />
        </View>

        {/* Gráficos */}
        <ItemGraficoBarra
          dados={dadosGerais.dadosItens}
          titulo="Itens mais usados"
          valor="totalHorasAlugadas"
          unidade="Horas"
        />

        <ItemGraficoBarra
          dados={dadosGerais.dadosItens}
          titulo="Itens mais rentáveis"
          valor="totalFaturado"
          unidade="R$"
          esquerda={true}
        />

        <ItemGraficoBarra
          dados={dadosGerais.dadosItens}
          titulo="Média de Itens por evento"
          valor="mediaPorEvento"
          unidade="unidades"
        />

        {/* Lista de Agendamentos */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Agendamentos realizados:</Text>

        {agendamentosFiltrados.length === 0 && (
          <Text style={styles.emptyText}>Nenhum agendamento neste período.</Text>
        )}

        {agendamentosFiltrados.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => router.push("/gerenciarAgendamentos")}>
            <View style={styles.cardBeige}>
              <Ionicons name="balloon" size={20} color="#000" style={{ marginRight: 10 }} />
              <Text style={styles.listName} numberOfLines={1}>{item.nome || "Sem nome"}</Text>
              <Text style={styles.listDate}>
                {item.dataInicio?.seconds ? formatarData(new Date(item.dataInicio.seconds * 1000)) : "-"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// Componente para os dados coletados
const InfoRow = ({ label, value, bold, icon, centered }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={[styles.infoValueBox, centered && { justifyContent: 'center', minWidth: 60 }]}>
      <Text style={[styles.infoValueText, bold && { fontWeight: 'bold' }]}>{value}</Text>
      {icon && <Ionicons name={icon} size={14} color="#000" style={{ marginLeft: 5 }} />}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },

  headerWrapper: {
    backgroundColor: "#000",
    paddingTop: 40,
    paddingBottom: 15
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20
  },
  titulo: {
    color: "#F2C94C",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15
  },

  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 2
  },
  filterLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 10
  },
  dateButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateText: {
    fontWeight: 'bold',
    marginRight: 5, fontSize: 13
  },

  exportButton: {
    backgroundColor: '#F2C94C',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exportText: {
    fontWeight: 'bold',
    fontSize: 14
  },
  pdfBadge: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginLeft: 10,
    height: 20
  },
  pdfBadgeText: {
    fontSize: 10,
    fontWeight: 'bold'
  },

  cardWhite: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  infoValueBox: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  infoValueText: {
    fontSize: 14,
    color: '#000'
  },

  cardBeige: {
    backgroundColor: '#EAE2D6',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  listName: {
    flex: 1,
    fontWeight: '500',
    fontSize: 14,
    color: '#333'
  },
  listDate: {
    fontSize: 14,
    color: '#555'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
  }
});