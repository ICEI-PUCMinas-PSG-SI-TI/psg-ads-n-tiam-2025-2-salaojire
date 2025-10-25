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

type Client = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
};

function initials(name: string) {
  const p = (name || "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}

export default function ClientesScreen() {
  const [q, setQ] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  // Modais
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewClient, setViewClient] = useState<Client | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  // Form (add/edit)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  // Coleção
  const colRef = collection(firestore, "Clientes");

  // Carregar em tempo real
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Clientes</Text>

        <TouchableOpacity onPress={openCreate} activeOpacity={0.8}>
          <Text style={styles.addAction}>+ Adicionar novo</Text>
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color="#999"
          style={{ marginRight: 8 }}
        />

        <TextInput
          placeholder="Pesquisar por um cliente"
          placeholderTextColor="#bdbdbd"
          value={q}
          onChangeText={setQ}
          style={styles.searchInput}
        />

        <TouchableOpacity style={{ padding: 6 }}>
          <Ionicons name="ellipsis-vertical" size={18} color="#bdbdbd" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90 }}
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

      {/* Tab bar (visual) */}
      <View style={styles.tabBar}>
        <TabItem icon="home" label="Homepage" />
        <TabItem icon="calendar" label="Calendário" />
        <TabItem icon="document-text" label="Relatórios" />
        <TabItem icon="person" label="Clientes" active />
        <TabItem icon="menu" label="Outros" />
      </View>

      {/* Confirmar exclusão (Não à esquerda / Sim à direita) */}
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
              {/* NÃO (esquerda) */}
              <TouchableOpacity
                onPress={() => setConfirmId(null)}
                style={[styles.btn, styles.btnPrimary]}
              >
                <Text style={[styles.btnText, { color: "#111" }]}>Não</Text>
              </TouchableOpacity>

              {/* SIM (direita) */}
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

      {/* Add/Edit modal */}
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

      {/* Visualizar – sem rota */}
      <Modal
        visible={viewOpen}
        animationType="slide"
        onRequestClose={() => setViewOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setViewOpen(false)}
              style={{ paddingRight: 8 }}
            >
              <Ionicons name="chevron-back" size={22} color="#F2C94C" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Visualizar Cliente</Text>
          </View>

          <View style={styles.searchWrap}>
            <Ionicons
              name="search"
              size={18}
              color="#999"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Pesquisar por um cliente"
              placeholderTextColor="#bdbdbd"
              style={styles.searchInput}
            />
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              editable={false}
              value={viewClient?.nome ?? ""}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              editable={false}
              value={viewClient?.email ?? ""}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              editable={false}
              value={viewClient?.telefone ?? ""}
            />
          </View>

          <View style={styles.card2}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>PEDIDOS REALIZADOS</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={styles.badgeYear}>
                  <Text style={{ fontWeight: "700", color: "#111" }}>2025</Text>
                </View>
                <Ionicons name="calendar" size={18} color="#111" />
                <Ionicons name="print" size={18} color="#111" />
              </View>
            </View>

            <View style={styles.orderRow}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                }}
              >
                <Ionicons name="time" size={16} color="#777" />

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontWeight: "700", color: "#111" }}>
                      07/10/2025
                    </Text>

                    <View style={styles.badgePaid}>
                      <Text style={styles.badgePaidText}>Pago</Text>
                    </View>
                  </View>

                  <Text style={{ color: "#777" }}>Exemplo de pedido</Text>
                </View>
              </View>

              <Text style={{ fontWeight: "700", color: "#111" }}>R$ 1200</Text>
            </View>
          </View>
        </SafeAreaView>
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
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={icon as any}
        size={18}
        color={active ? "#111" : "#F2C94C"}
      />
      <Text style={[styles.tabLabel, active && { color: "#111" }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#F2C94C", fontSize: 18, fontWeight: "700" },
  addAction: { color: "#F2C94C", fontWeight: "700" },

  searchWrap: {
    marginHorizontal: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  searchInput: { color: "#fff", flex: 1, fontSize: 14 },

  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#F2C94C",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 6,
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 11, marginTop: 2, color: "#111", fontWeight: "600" },

  // Modais (exclusão)
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

  // Modal (add/edit)
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
  btnPrimaryBig: {
    marginTop: 16,
    backgroundColor: "#F2C94C",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },

  // Visualizar
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
  },
  badgePaid: {
    backgroundColor: "#D7FFD9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgePaidText: { color: "#1B5E20", fontWeight: "700", fontSize: 12 },
});
