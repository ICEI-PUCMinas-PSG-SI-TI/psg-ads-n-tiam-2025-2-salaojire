import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import FirebaseAPI from "@packages/firebase";

// ---------- TIPOS ----------

type ShortcutProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
};

type PillButtonProps = {
  label: string;
  onPress?: () => void;
};

type SolicitacaoHome = {
  id: string;
  cliente: string;
  data: Date | null;
};

type AgendamentoHome = {
  id: string;
  nome: string;
  dataInicio: Date | null;
  valorTotal: number;
  status?: string;
};

type FinanceiroHome = {
  total: number;
  eventos: number;
  itens: number;
};

// ---------- COMPONENTES AUXILIARES ----------

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

function PillButton({ label, onPress }: PillButtonProps) {
  return (
    <TouchableOpacity
      style={styles.pillButton}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text style={styles.pillButtonText}>{label}</Text>
      <Ionicons name="arrow-forward" size={14} color="#000" />
    </TouchableOpacity>
  );
}

// Função auxiliar para converter qualquer tipo de dado de data do Firestore/string em um objeto Date
function parseDate(d: any): Date | null {
  if (!d) return null;
  if (d instanceof Date) return d;

  // Firestore Timestamp (seconds / nanoseconds)
  if (typeof d === "object" && d !== null) {
    if ("seconds" in d && typeof d.seconds === "number") {
      const parsed = new Date(d.seconds * 1000);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  if (typeof d === "string" || typeof d === "number") {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

// ---------- HOMEPAGE ----------

export default function HomepageScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoHome[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoHome[]>([]);
  const [financeiro, setFinanceiro] = useState<FinanceiroHome>({
    total: 0,
    eventos: 0,
    itens: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const raw = user?.email?.split("@")[0] ?? "Salaojire";
  const firstName = raw.charAt(0).toUpperCase() + raw.slice(1);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);

        // 1) Carrega todos os clientes para mapear id -> nome
        const clientes: any[] =
          await FirebaseAPI.firestore.clientes.getClientes();
        const mapaClientes = new Map<string, string>();
        clientes.forEach((c: any) => {
          mapaClientes.set(c.id, c.nome ?? "Cliente");
        });

        // 2) Carrega TODAS as solicitações de TODOS os clientes
        const solicitacoesGerais: any[] =
          await FirebaseAPI.firestore.clientes.getAllSolicitacoes();

        const solicitacoesTratadas: SolicitacaoHome[] = solicitacoesGerais
          .map((s) => {
            // tenta pegar dataSolicitacao, se não tiver tenta cair pra dataInicio ou dataFim
            const dataBruta =
              s.dataSolicitacao ?? s.dataInicio ?? s.dataFim ?? null;

            return {
              id: s.id,
              cliente: mapaClientes.get(s.clienteId) ?? "Cliente",
              data: parseDate(dataBruta),
            };
          })
          .sort((a, b) => {
            const ta = a.data ? a.data.getTime() : 0;
            const tb = b.data ? b.data.getTime() : 0;
            return tb - ta; // mais recentes primeiro
          });

        console.log(
          "[HOME] Solicitações carregadas:",
          solicitacoesTratadas.length,
          solicitacoesTratadas
        );

        // Mostra só as 3 mais recentes
        setSolicitacoes(solicitacoesTratadas.slice(0, 3));

        // 3) Carregar agendamentos (pode usar getAllAgendamentos direto)
        const agendamentosGerais: any[] =
          await FirebaseAPI.firestore.clientes.getAllAgendamentos();

        const todosAgendamentos: AgendamentoHome[] = agendamentosGerais.map(
          (a) => ({
            id: a.id,
            nome: a.nome ?? "Evento",
            dataInicio: parseDate(a.dataInicio),
            valorTotal:
              typeof a.valorTotal === "number" ? a.valorTotal : 0,
            status: a.status,
          })
        );

        // ============================
        // PRÓXIMOS EVENTOS:
        // - Apenas datas >= hoje
        // - Em ordem crescente (mais perto de hoje primeiro)
        // ============================

        const agora = new Date();
        const hojeZerado = new Date(
          agora.getFullYear(),
          agora.getMonth(),
          agora.getDate(),
          0,
          0,
          0,
          0
        );
        const hojeTs = hojeZerado.getTime();

        const agendamentosFuturos = todosAgendamentos
          .filter((a) => a.dataInicio && a.dataInicio.getTime() >= hojeTs)
          .sort((a, b) => {
            const ta = a.dataInicio!.getTime();
            const tb = b.dataInicio!.getTime();
            return ta - tb; // mais perto de hoje primeiro
          });

        // Cálculo financeiro (últimos 30 dias)
        const limite = new Date(
          hojeTs - 30 * 24 * 60 * 60 * 1000
        );

        const agendsUlt30 = todosAgendamentos.filter(
          (a) =>
            a.dataInicio &&
            a.dataInicio.getTime() >= limite.getTime() &&
            a.dataInicio.getTime() <= agora.getTime()
        );

        const total = agendsUlt30.reduce(
          (acc, cur) => acc + (cur.valorTotal || 0),
          0
        );

        setFinanceiro({
          total,
          eventos: agendsUlt30.length,
          itens: 15, // placeholder até integrar com itens alugados
        });

        setAgendamentos(agendamentosFuturos.slice(0, 3));
      } catch (e) {
        console.error("Erro ao carregar dashboard:", e);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
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
                  onPress={() => {}}
                />
                <ShortcutButton
                  icon="calendar-outline"
                  label="Calendário"
                  onPress={() => router.push("/calendario")}
                />
                <ShortcutButton
                  icon="chatbox-ellipses-outline"
                  label="Solicitações"
                  onPress={() => router.push("/clientes")}
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
                  onPress={() => {}}
                />
                <ShortcutButton
                  icon="settings-outline"
                  label="Configurações"
                  onPress={() => router.push("/(pages)/configuracoes")}
                />

                {/* Espaço vazio para ficar alinhado em 4 colunas */}
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
                  <Ionicons
                    name="chatbubbles-outline"
                    size={22}
                    color="#000"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>Novas Solicitações</Text>
                  <Text style={styles.cardText}>
                    {loading
                      ? "Carregando..."
                      : `Houve ${solicitacoes.length} novas solicitações recentes`}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.cardIconRight}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color="#F0B100"
                  />
                </TouchableOpacity>
              </View>

              {!loading && solicitacoes.length === 0 && (
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#555",
                  }}
                >
                  Nenhuma solicitação recente.
                </Text>
              )}

              {!loading &&
                solicitacoes.map((s) => (
                  <Text
                    key={s.id}
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "#555",
                    }}
                  >
                    • {s.cliente} —{" "}
                    {s.data?.toLocaleDateString() ?? "--/--/----"}
                  </Text>
                ))}
            </View>

            {/* Card Próximos Agendamentos */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitleEmphasis}>
                  Próximos Agendamentos
                </Text>
                <TouchableOpacity
                  style={styles.yearBadge}
                  activeOpacity={0.8}
                >
                  <Text style={styles.yearBadgeText}>2025</Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="#111"
                  />
                </TouchableOpacity>
              </View>

              {loading && (
                <Text style={{ fontSize: 12, color: "#777" }}>
                  Carregando agendamentos...
                </Text>
              )}

              {!loading && agendamentos.length === 0 && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#777",
                    marginTop: 4,
                  }}
                >
                  Nenhum agendamento futuro encontrado.
                </Text>
              )}

              {!loading &&
                agendamentos.map((a) => (
                  <View key={a.id} style={styles.agendamentoRow}>
                    <View style={styles.agendamentoLeft}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color="#111"
                      />
                      <View style={{ marginLeft: 8 }}>
                        <Text style={styles.agendamentoData}>
                          {a.dataInicio?.toLocaleDateString() ??
                            "--/--/----"}
                        </Text>
                        <Text style={styles.agendamentoDescricao}>
                          {a.nome}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.agendamentoRight}>
                      <Text style={styles.agendamentoValor}>
                        R$ {a.valorTotal.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}

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
                    <Ionicons
                      name="cash-outline"
                      size={22}
                      color="#000"
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.cardTitle}>Atividade Financeira</Text>
                    <Text style={styles.cardSubtitleBig}>
                      R$ {financeiro.total.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.smallMuted}>Últimos 30 dias</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Eventos Realizados</Text>
                <Text style={styles.metricValue}>
                  {financeiro.eventos}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Itens Alugados</Text>
                <Text style={styles.metricValue}>
                  {financeiro.itens}
                </Text>
              </View>

              <View style={styles.cardFooterCenter}>
                <PillButton
                  label="Relatórios"
                  onPress={() => {}}
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
