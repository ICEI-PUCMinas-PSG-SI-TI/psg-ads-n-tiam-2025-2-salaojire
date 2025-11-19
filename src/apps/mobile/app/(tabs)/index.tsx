import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

type ShortcutProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
};

function ShortcutButton({ icon, label, onPress }: ShortcutProps) {
  return (
    <TouchableOpacity
      style={styles.shortcut}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.shortcutIconBox}>
        <Ionicons name={icon} size={26} color="#111" />
      </View>
      <Text style={styles.shortcutLabel} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PillButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.pillButton} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.pillButtonText}>{label}</Text>
      <Ionicons name="arrow-forward" size={14} color="#000" />
    </TouchableOpacity>
  );
}

export default function HomepageScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const raw = user?.email?.split("@")[0] ?? "Salaojire";
  const firstName = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER AMARELO */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.appTitle}>Jiré Festas – Gerência</Text>
            <Text style={styles.greeting}>Olá, {firstName}!</Text>

            {/* GRID DE ATALHOS */}
            <View style={styles.shortcutsWrapper}>
              {/* Linha 1: Agendamentos, Itens, Calendário, Solicitações */}
              <View style={styles.shortcutRow}>
                <ShortcutButton
                  icon="clipboard-outline"
                  label="Agendamentos"
                  onPress={() => router.push("/gerenciarAgendamentos")}
                />
                <ShortcutButton
                  icon="cube-outline"
                  label="Itens"
                  onPress={() => router.push("/relatorios")}
                />
                <ShortcutButton
                  icon="calendar-outline"
                  label="Calendário"
                  onPress={() => router.push("/calendario")}
                />
                <ShortcutButton
                  icon="chatbox-ellipses-outline"
                  label="Solicitações"
                  // Quando a tela de solicitações existir:
                  // onPress={() => router.push("/solicitacoes")}
                />
              </View>

              {/* Linha 2: Clientes, Relatórios, Configurações */}
              <View style={styles.shortcutRow}>
                <ShortcutButton
                  icon="people-outline"
                  label="Clientes"
                  onPress={() => router.push("/clientes")}
                />
                <ShortcutButton
                  icon="bar-chart-outline"
                  label="Relatórios"
                  // Quando a tela de relatórios financeiros existir:
                  // onPress={() => router.push("/relatoriosFinanceiros")}
                />
                <ShortcutButton
                  icon="settings-outline"
                  label="Configurações"
                  // Exemplo: depois pode mandar pra /outros ou /configuracoes
                  // onPress={() => router.push("/outros")}
                />
                {/* Espaço vazio para ficar visualmente alinhado em 4 colunas */}
                <View style={[styles.shortcut, { opacity: 0 }]} />
              </View>
            </View>
          </View>
        </View>

        {/* CORPO BRANCO / CARDS */}
        <View style={styles.body}>
          <View style={styles.bodyInner}>
            {/* Card Novas Solicitações */}
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconCircle}>
                  <Ionicons name="chatbubbles-outline" size={22} color="#000" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>Novas Solicitações</Text>
                  <Text style={styles.cardText}>
                    Houve 2 novas solicitações desde seu último login!
                  </Text>
                </View>
                <TouchableOpacity
                  // onPress={() => router.push("/solicitacoes")}
                  style={styles.cardIconRight}
                >
                  <Ionicons name="ellipsis-horizontal" size={20} color="#F0B100" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Card Próximos Agendamentos */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitleEmphasis}>Próximos Agendamentos</Text>
                <TouchableOpacity style={styles.yearBadge} activeOpacity={0.8}>
                  <Text style={styles.yearBadgeText}>2025</Text>
                  <Ionicons name="chevron-down" size={14} color="#111" />
                </TouchableOpacity>
              </View>

              {/* Agendamento 1 */}
              <View style={styles.agendamentoRow}>
                <View style={styles.agendamentoLeft}>
                  <Ionicons name="time-outline" size={18} color="#111" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.agendamentoData}>07/10/2025</Text>
                    <Text style={styles.agendamentoDescricao}>
                      Maria | Festa de Aniversário
                    </Text>
                  </View>
                </View>
                <View style={styles.agendamentoRight}>
                  <View style={[styles.statusTag, styles.statusPago]}>
                    <Text style={styles.statusText}>Pago</Text>
                  </View>
                  <Text style={styles.agendamentoValor}>R$ 1125</Text>
                </View>
              </View>

              {/* Agendamento 2 */}
              <View style={styles.agendamentoRow}>
                <View style={styles.agendamentoLeft}>
                  <Ionicons name="time-outline" size={18} color="#111" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.agendamentoData}>14/10/2025</Text>
                    <Text style={styles.agendamentoDescricao}>
                      Leandro | Evento Corporativo
                    </Text>
                  </View>
                </View>
                <View style={styles.agendamentoRight}>
                  <View style={[styles.statusTag, styles.statusParcial]}>
                    <Text style={styles.statusText}>Parcialmente Pago</Text>
                  </View>
                  <Text style={styles.agendamentoValor}>R$ 750</Text>
                </View>
              </View>

              {/* Agendamento 3 */}
              <View style={styles.agendamentoRow}>
                <View style={styles.agendamentoLeft}>
                  <Ionicons name="time-outline" size={18} color="#111" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.agendamentoData}>17/10/2025</Text>
                    <Text style={styles.agendamentoDescricao}>
                      Raissa | 10 Jogos de Mesa
                    </Text>
                  </View>
                </View>
                <View style={styles.agendamentoRight}>
                  <View style={[styles.statusTag, styles.statusParcial]}>
                    <Text style={styles.statusText}>Parcialmente Pago</Text>
                  </View>
                  <Text style={styles.agendamentoValor}>R$ 130</Text>
                </View>
              </View>

              <View style={styles.cardFooterCenter}>
                <PillButton
                  label="Calendário"
                  onPress={() => router.push("/calendario")}
                />
              </View>
            </View>

            {/* Card Atividade Financeira */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.cardIconCircle}>
                    <Ionicons name="cash-outline" size={22} color="#000" />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.cardTitle}>Atividade Financeira</Text>
                    <Text style={styles.cardSubtitleBig}>R$ 1945</Text>
                  </View>
                </View>

                <Text style={styles.smallMuted}>7 dias</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Eventos Realizados</Text>
                <Text style={styles.metricValue}>2</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Valor Recebido</Text>
                <Text style={styles.metricValue}>R$ 1750</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Itens Alugados</Text>
                <Text style={styles.metricValue}>15</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Valor Recebido</Text>
                <Text style={styles.metricValue}>R$ 195</Text>
              </View>

              <View style={styles.cardFooterCenter}>
                <PillButton
                  label="Relatórios"
                  // Quando a tela de relatórios existir:
                  // onPress={() => router.push("/relatoriosFinanceiros")}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ESTILOS */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  scrollContent: {
    paddingBottom: 32,
  },

  /* HEADER */
  header: {
    backgroundColor: "#F0B100",
    paddingTop: 18,
    paddingBottom: 26,
  },
  headerInner: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  greeting: {
    marginTop: 6,
    fontSize: 16,
    color: "#111",
  },

  shortcutsWrapper: {
    marginTop: 24,
  },
  shortcutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  shortcut: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  shortcutIconBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.09)",
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
  },

  body: {
    paddingTop: 18,
    paddingBottom: 16,
  },
  bodyInner: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 16,
    gap: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#FFF5CC",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconRight: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  cardTitleEmphasis: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
  },
  cardText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  cardSubtitleBig: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  smallMuted: {
    fontSize: 12,
    color: "#777",
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  yearBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
  },
  yearBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    marginRight: 4,
  },

  /* AGENDAMENTOS */
  agendamentoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  agendamentoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  agendamentoRight: {
    alignItems: "flex-end",
  },
  agendamentoData: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  agendamentoDescricao: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  agendamentoValor: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },

  statusTag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  statusPago: {
    backgroundColor: "#E0F7EC",
  },
  statusParcial: {
    backgroundColor: "#FFE7CC",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#111",
  },

  /* MÉTRICAS FINANCEIRAS */
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: "#555",
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },

  /* BOTÃO PILL */
  cardFooterCenter: {
    marginTop: 14,
    alignItems: "flex-start",
  },
  pillButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0B100",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 6,
    alignSelf: "flex-start",
  },
  pillButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
  },
});
