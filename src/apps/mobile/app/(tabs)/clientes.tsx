import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { firestore } from "@packages/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Buscar agendamentos do cliente
import FirebaseAPI from "@packages/firebase";

type Client = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
};

type Agendamento = {
  id: string;
  nome?: string;
  status?: string;
  dataInicio?: { seconds: number } | string | Date;
  dataFim?: { seconds: number } | string | Date;
  valorTotal?: number;
  itensAlugados?: any[];
};

function initials(name: string) {
  const p = (name || "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}

function toDateString(d?: { seconds: number } | string | Date) {
  if (!d) return "";
  let date: Date;
  if (typeof d === "string") date = new Date(d);
  else if (d instanceof Date) date = d;
  else if (typeof d === "object" && "seconds" in d) date = new Date(d.seconds * 1000);
  else return "";
  return date.toLocaleDateString();
}

function statusStyle(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "pago" || s === "concluido" || s === "concluído") {
    return { bg: "#D7FFD9", fg: "#1B5E20", label: "Pago" };
  }
  if (s === "cancelado") {
    return { bg: "#FFE0E0", fg: "#B71C1C", label: "Cancelado" };
  }
  if (s === "agendado") {
    return { bg: "#FFF7CC", fg: "#7A5A00", label: "Agendado" };
  }
  return { bg: "#EEE", fg: "#555", label: status || "Pendente" };
}

function money(v?: number) {
  if (typeof v !== "number") return "—";
  return `R$ ${v.toFixed(2)}`;
}

export default function ClientesScreen() {
  const [q, setQ] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewClient, setViewClient] = useState<Client | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  // Pedidos do cliente
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  // Modal de detalhes do agendamento (apenas exibir)
  const [orderOpen, setOrderOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Agendamento | null>(null);

  const colRef = collection(firestore, "Clientes");

  useEffect(() => {
    const qRef = query(colRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const rows: Client[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          rows.push({
            id: d.id,
            nome: data.nome ?? "",
            email: data.email ?? "",
            telefone: data.telefone ?? "",
            senha: data.senha,
          });
        });
        setClients(rows);
      },
      (err) => {
        console.error(err);
        Alert.alert("Erro", "Falha ao carregar clientes.");
      }
    );

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return s
      ? clients.filter(
          (c) =>
            c.nome.toLowerCase().includes(s) ||
            c.email.toLowerCase().includes(s) ||
            c.telefone?.toLowerCase?.().includes(s)
        )
      : clients;
  }, [q, clients]);

  async function carregarAgendamentos(clienteId: string) {
    try {
      const lista = await FirebaseAPI.firestore.clientes.getAgendamentosFromCliente(clienteId);
      const formatada: Agendamento[] = (lista || []).map((a: any) => ({
        id: a.id,
        nome: a.nome || "Evento sem nome",
        status: a.status || "pendente",
        dataInicio: a.dataInicio,
        dataFim: a.dataFim,
        valorTotal: a.valorTotal,
        itensAlugados: a.itensAlugados || [],
      }));
      setAgendamentos(formatada);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao carregar pedidos do cliente.");
    }
  }

  function openCreate() {
    setEditing(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setEditOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setNome(c.nome);
    setEmail(c.email);
    setTelefone(c.telefone ?? "");
    setSenha("");
    setEditOpen(true);
  }

  function openView(c: Client) {
    setViewClient(c);
    setViewOpen(true);
    carregarAgendamentos(c.id);
  }

  function openPedido(ped: Agendamento) {
    setPedidoSelecionado(ped);
    setOrderOpen(true);
  }

  async function save() {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      return Alert.alert("Atenção", "Preencha nome, email e telefone.");
    }

    try {
      if (editing) {
        await updateDoc(doc(firestore, "Clientes", editing.id), {
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
        });
        Alert.alert("Sucesso", "Cliente atualizado.");
      } else {
        await addDoc(colRef, {
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
          ...(senha ? { senha } : {}),
          createdAt: serverTimestamp(),
        });
        Alert.alert("Sucesso", "Cliente cadastrado.");
      }
      setEditOpen(false);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro", e?.message ?? "Falha ao salvar.");
    }
  }

  async function remove(id: string) {
    try {
      await deleteDoc(doc(firestore, "Clientes", id));
      setConfirmId(null);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro", e?.message ?? "Falha ao excluir.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Clientes</Text>

        {/* Busca */}
        <View style={styles.ContainerBusca}>
          <Ionicons
            name="search"
            size={20}
            color="#FFD700"
            style={{ marginRight: 8 }}
          />

          <TextInput
            placeholder="Pesquisar por um cliente"
            placeholderTextColor="#ccc"
            value={q}
            onChangeText={setQ}
            style={styles.InputBusca}
          />
        </View>
      </View>

      {/* Botão adicionar */}
      <View>
        <TouchableOpacity style={styles.Bottom} onPress={openCreate}>
          <Text style={styles.BottomText}>+ Adicionar novo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de clientes */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90, paddingTop: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(item.nome)}</Text>
            </View>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.7}
              onPress={() => openView(item)}
            >
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConfirmId(item.id)}
              style={{ paddingHorizontal: 8 }}
            >
              <Ionicons name="trash" size={20} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openEdit(item)}
              style={{ paddingHorizontal: 8 }}
            >
              <Ionicons name="create" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
      />

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home" label="Homepage" />
        <TabItem icon="calendar" label="Calendário" />
        <TabItem icon="document-text" label="Relatórios" />
        <TabItem icon="person" label="Clientes" active />
        <TabItem icon="menu" label="Outros" />
      </View>

      {/* Modal confirmar exclusão */}
      <Modal
        visible={!!confirmId}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmId(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Ionicons
              name="trash"
              size={56}
              color="#111"
              style={{ marginBottom: 12 }}
            />

            <Text style={styles.title}>
              Você tem certeza que deseja excluir este cliente?
            </Text>

            <Text style={styles.sub}>Confirme a sua opção</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => setConfirmId(null)}
                style={[styles.btn, styles.btnPrimary]}
              >
                <Text style={[styles.btnText, { color: "#111" }]}>Não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmId && remove(confirmId)}
                style={[styles.btn, styles.btnOutlineDanger]}
              >
                <Text style={[styles.btnText, { color: "#E53935" }]}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal criar/editar */}
      <Modal
        visible={editOpen}
        animationType="slide"
        onRequestClose={() => setEditOpen(false)}
        transparent
      >
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.rowTop}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={editing ? "create" : "add"}
                  size={22}
                  color="#111"
                />
              </View>

              <TouchableOpacity
                onPress={() => setEditOpen(false)}
                style={{ padding: 8 }}
              >
                <Ionicons name="close" size={18} color="#777" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title2}>
              {editing ? "Editar Cliente" : "Cadastrar Cliente"}
            </Text>

            <Text style={styles.sub}>Preencha as informações necessárias</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              placeholderTextColor="#bdbdbd"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o email"
              placeholderTextColor="#bdbdbd"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o telefone"
              placeholderTextColor="#bdbdbd"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />

            {!editing && (
              <>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a senha"
                  placeholderTextColor="#bdbdbd"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity style={styles.btnPrimaryBig} onPress={save}>
              <Text style={[styles.btnText, { color: "#111" }]}>
                {editing ? "Salvar" : "Cadastrar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal visualizar cliente + pedidos */}
      <Modal
        visible={viewOpen}
        animationType="slide"
        onRequestClose={() => setViewOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setViewOpen(false)}
              style={{ paddingRight: 8 }}
            >
              <Ionicons name="chevron-back" size={22} color="#F2C94C" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Visualizar Cliente</Text>
          </View>

          {/* Busca fake (apenas visual) */}
          <View style={styles.ContainerBusca}>
            <Ionicons
              name="search"
              size={18}
              color="#999"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Pesquisar por um cliente"
              placeholderTextColor="#999"
              style={styles.InputBusca}
              editable={false}
            />
          </View>

          {/* Dados do cliente */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.inputDisabled}
              editable={false}
              value={viewClient?.nome ?? ""}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.inputDisabled}
              editable={false}
              value={viewClient?.email ?? ""}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.inputDisabled}
              editable={false}
              value={viewClient?.telefone ?? ""}
            />
          </View>

          {/* Pedidos realizados */}
          <View style={styles.card2}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>PEDIDOS REALIZADOS</Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={styles.badgeYear}>
                  <Text style={{ fontWeight: "700", color: "#111" }}>2025</Text>
                </View>
                <Ionicons name="calendar" size={18} color="#111" />
                <Ionicons name="print" size={18} color="#111" />
              </View>
            </View>

            {/* Lista dinâmica dos agendamentos com status (toque abre apenas o modal de detalhes) */}
            {agendamentos.length === 0 ? (
              <Text style={{ color: "#777", marginTop: 8 }}>Nenhum pedido encontrado.</Text>
            ) : (
              agendamentos.map((ped) => {
                const st = statusStyle(ped.status);
                return (
                  <TouchableOpacity key={ped.id} activeOpacity={0.8} onPress={() => openPedido(ped)}>
                    <View style={styles.orderRow}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                        <Ionicons name="time" size={16} color="#777" />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ fontWeight: "700", color: "#111" }}>
                              {toDateString(ped.dataInicio)}
                              {ped.dataFim ? ` — ${toDateString(ped.dataFim)}` : ""}
                            </Text>

                            <View
                              style={{
                                backgroundColor: st.bg,
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                              }}
                            >
                              <Text style={{ color: st.fg, fontWeight: "700", fontSize: 12 }}>
                                {st.label}
                              </Text>
                            </View>
                          </View>

                          <Text style={{ color: "#777" }}>{ped.nome}</Text>
                        </View>
                      </View>

                      <Text style={{ fontWeight: "700", color: "#111" }}>{money(ped.valorTotal)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal de detalhes do agendamento (somente exibir) */}
      <Modal
        visible={orderOpen}
        animationType="slide"
        onRequestClose={() => setOrderOpen(false)}
        transparent
      >
        <View style={styles.sheetBackdrop}>
          <View style={[styles.sheet, { maxHeight: "85%" }]}>
            <View style={styles.rowTop}>
              <View style={styles.iconBox}>
                <Ionicons name="clipboard" size={22} color="#111" />
              </View>

              <TouchableOpacity onPress={() => setOrderOpen(false)} style={{ padding: 8 }}>
                <Ionicons name="close" size={18} color="#777" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title2}>Detalhes do Agendamento</Text>
            <Text style={styles.sub}>Veja as informações completas do pedido</Text>

            <ScrollView style={{ marginTop: 8 }}>
              {/* Nome e status */}
              <Text style={styles.label}>Evento</Text>
              <TextInput
                style={styles.inputDisabled}
                editable={false}
                value={pedidoSelecionado?.nome || ""}
              />

              <Text style={styles.label}>Status</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {(() => {
                  const st = statusStyle(pedidoSelecionado?.status);
                  return (
                    <View style={{ backgroundColor: st.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ color: st.fg, fontWeight: "700" }}>{st.label}</Text>
                    </View>
                  );
                })()}
              </View>

              {/* Datas */}
              <Text style={styles.label}>Período</Text>
              <TextInput
                style={styles.inputDisabled}
                editable={false}
                value={
                  pedidoSelecionado
                    ? `${toDateString(pedidoSelecionado.dataInicio)}${pedidoSelecionado.dataFim ? ` — ${toDateString(pedidoSelecionado.dataFim)}` : ""}`
                    : ""
                }
              />

              {/* Valor */}
              <Text style={styles.label}>Valor Total</Text>
              <TextInput
                style={styles.inputDisabled}
                editable={false}
                value={money(pedidoSelecionado?.valorTotal)}
              />

              {/* Itens alugados */}
              <Text style={styles.label}>Itens Alugados</Text>
              {pedidoSelecionado?.itensAlugados && pedidoSelecionado?.itensAlugados.length > 0 ? (
                <View style={{ gap: 6 }}>
                  {pedidoSelecionado.itensAlugados.map((it: any) => (
                    <View
                      key={it.id || `${it.nome}-${Math.random()}`}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        backgroundColor: "#F9F9F9",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#EEE",
                      }}
                    >
                      <Text style={{ color: "#222", fontWeight: "600" }}>{it.nome || "Item"}</Text>
                      <Text style={{ color: "#555" }}>{money(it.precoAluguel)}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ color: "#777" }}>Nenhum item listado.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TabItem({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  const color = active ? "#FFF" : "#F2C94C";
  return (
    <View style={styles.tabItem}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={[styles.tabLabel, { color: color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#000",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  headerTitle: {
    color: "#F2C94C",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  addAction: { color: "#F2C94C", fontWeight: "700" },

  ContainerBusca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 45,
  },

  InputBusca: {
    color: "#fff",
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },

  Bottom: {
    backgroundColor: "#ffd900ff",
    height: 40,
    width: 150,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 20,
  },
  BottomText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },

  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
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
  name: { color: "#111", fontWeight: "700" },
  email: { color: "#777", fontSize: 12 },

  tabBar: {
    height: 62,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 6,
  },
  tabItem: { alignItems: "center" },

  tabLabel: { fontSize: 11, marginTop: 2, color: "#F2C94C", fontWeight: "600" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: { textAlign: "center", color: "#111", fontWeight: "800", fontSize: 16 },
  sub: { color: "#666", marginTop: 8, marginBottom: 16 },
  actions: { flexDirection: "row", gap: 12, alignSelf: "stretch" },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  btnOutlineDanger: { borderColor: "#E53935", backgroundColor: "#fff" },
  btnPrimary: { borderColor: "#F2C94C", backgroundColor: "#F2C94C" },
  btnText: { fontWeight: "800" },

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  title2: { fontSize: 18, fontWeight: "800", color: "#111", marginTop: 8 },
  label: { color: "#111", fontWeight: "700", marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111",
  },

  inputDisabled: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#555",
  },
  btnPrimaryBig: {
    marginTop: 16,
    backgroundColor: "#F2C94C",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },

  card2: {
    margin: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontWeight: "900", color: "#111", letterSpacing: 0.2 },
  badgeYear: {
    backgroundColor: "#F2C94C",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  orderRow: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  badgePaid: {
    backgroundColor: "#D7FFD9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgePaidText: { color: "#1B5E20", fontWeight: "700", fontSize: 12 },
});
