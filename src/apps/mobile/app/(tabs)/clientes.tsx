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
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

//tratamento de imagens
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import CryptoJS from "crypto-js";


const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_URL,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY
} = Constants.expoConfig!.extra!;
//fim

function initials(name: string) {
  const p = (name || "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}

function toDateString(d?: { seconds: number } | string | Date) {
  if (!d) return "";
  let date: Date;
  if (typeof d === "string") date = new Date(d);
  else if (d instanceof Date) date = d;
  else if (typeof d === "object" && "seconds" in d)
    date = new Date(d.seconds * 1000);
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
  const router = useRouter();

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
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<Agendamento | null>(null);

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
      const lista =
        await FirebaseAPI.firestore.clientes.getAgendamentosFromCliente(
          clienteId
        );
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

  //config para add imagens e videos ------------------------------------------------------------------------------------------------------------------------------
  const CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [midias, setMidias] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const screenWidth = Dimensions.get("window").width;

  // Carregar mídias do Firestore
  useEffect(() => {
    if (!viewClient?.id) return;

    const q = query(
      collection(firestore, "Clientes", viewClient.id, "midias"),
      orderBy("criadoEm", "desc")
    );


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const midiasArray: any[] = [];
      querySnapshot.forEach((doc) => {
        midiasArray.push({ id: doc.id, ...doc.data() });
      });
      setMidias(midiasArray);
    });

    return () => unsubscribe();
  }, [viewClient?.id]);

  const handlePickMedia = async () => {
    try {
      // Solicitar permissões
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Precisamos de acesso à galeria para enviar mídias.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        allowsEditing: false,
        quality: 0.8, // Reduzindo um pouco a qualidade para upload mais rápido
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);
        setUploadProgress(0);

        const totalFiles = result.assets.length;
        let successfulUploads = 0;

        for (let i = 0; i < totalFiles; i++) {
          const file = result.assets[i];
          const success = await uploadToCloudinary(file.uri);

          if (success) {
            successfulUploads++;
          }

          // Atualizar progresso
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        }

        setUploading(false);

        if (successfulUploads === totalFiles) {
          alert(`✅ ${successfulUploads} mídia(s) enviada(s) com sucesso!`);
        } else {
          alert(`⚠️ ${successfulUploads} de ${totalFiles} mídias enviadas.`);
        }
      }
    } catch (err) {
      setUploading(false);
      console.log("Erro ao selecionar mídia:", err);
      alert("Erro ao enviar mídias. Tente novamente.");
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const uploadToCloudinary = async (uri: string): Promise<boolean> => {
    try {
      // Detectar tipo de mídia
      const fileExtension = uri.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';

      if (fileExtension === 'mp4' || fileExtension === 'mov') {
        mimeType = 'video/mp4';
      } else if (fileExtension === 'png') {
        mimeType = 'image/png';
      }

      const data = new FormData();
      data.append("file", {
        uri,
        type: mimeType,
        name: `upload_${Date.now()}.${fileExtension}`,
      } as any);

      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `${CLOUDINARY_API_URL}/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: data,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.secure_url) {
        console.log("✔ URL Cloudinary:", result.secure_url);

        // Salvar no Firestore
        await addDoc(
          collection(firestore, "Clientes", viewClient!.id, "midias"),
          {
            url: result.secure_url,
            tipo: mimeType.startsWith('video') ? 'video' : 'imagem',
            nome: `midia_${Date.now()}`,
            criadoEm: new Date(),
            tamanho: result.bytes,
          }
        );
        return true;
      }

      return false;
    } catch (err) {
      console.log("❌ Erro Cloudinary:", err);
      return false;
    }
  };

  const handleDeleteMedia = async (mediaId: string, mediaUrl: string) => {
    try {
      // Confirmação antes de excluir
      Alert.alert(
        'Deseja excluir esta mídia?',
        'Esta ação não pode ser desfeita.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              await deleteFromCloudinary(mediaUrl);
              await deleteDoc(doc(firestore, "Clientes", viewClient!.id, "midias", mediaId));

              Alert.alert('Mídia excluída com sucesso!');

              // Fechar modal se estiver aberto
              if (modalVisible) {
                setModalVisible(false);
              }
            },
          },
        ]
      );
    } catch (err) {
      console.log("❌ Erro ao excluir mídia:", err);
      Alert.alert("Erro ao excluir mídia. Tente novamente.");
    }
  };

  const deleteFromCloudinary = async (url: string) => {
    try {
      const parts = url.split('/');
      const publicIdWithExtension = parts[parts.length - 1];
      const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // remove extensão

      const timestamp = Math.floor(Date.now() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
      const signature = CryptoJS.SHA1(stringToSign).toString();

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("signature", signature);
      formData.append("api_key", CLOUDINARY_API_KEY);
      formData.append("timestamp", String(timestamp));

      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );

      return true;
    }
    catch (err) {
      console.log(err)
    }
  };

  // Componente para mostrar a galeria de mídias
  const GalleryGrid = () => {
    if (midias.length === 0) {
      return (
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Nenhuma mídia adicionada ainda.{'\n'}
            Clique no botão acima para adicionar fotos e vídeos.
          </Text>
        </View>
      );
    }
  }
  // Componente carrossel de imagens 
  const CarouselModal = () => {
    if (!midias || midias.length === 0) return null;
  }
  // fim da manipulacao de imagens -------------------------------------------------------------------------------------------------------------------------------------------

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={{ paddingRight: 8 }}
          >
            <Ionicons name="chevron-back" size={22} color="#F2C94C" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Gerenciar Clientes</Text>
        </View>

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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 90,
          paddingTop: 12,
        }}
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

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.badgeYear}>
                  <Text style={{ fontWeight: "700", color: "#111" }}>2025</Text>
                </View>
                <Ionicons name="calendar" size={18} color="#111" />
                <Ionicons name="print" size={18} color="#111" />
              </View>
            </View>

            {/* Lista dinâmica dos agendamentos com status (toque abre apenas o modal de detalhes) */}
            {agendamentos.length === 0 ? (
              <Text style={{ color: "#777", marginTop: 8 }}>
                Nenhum pedido encontrado.
              </Text>
            ) : (
              agendamentos.map((ped) => {
                const st = statusStyle(ped.status);
                return (
                  <TouchableOpacity
                    key={ped.id}
                    activeOpacity={0.8}
                    onPress={() => openPedido(ped)}
                  >
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
                              {toDateString(ped.dataInicio)}
                              {ped.dataFim
                                ? ` — ${toDateString(ped.dataFim)}`
                                : ""}
                            </Text>

                            <View
                              style={{
                                backgroundColor: st.bg,
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                              }}
                            >
                              <Text
                                style={{
                                  color: st.fg,
                                  fontWeight: "700",
                                  fontSize: 12,
                                }}
                              >
                                {st.label}
                              </Text>
                            </View>
                          </View>

                          <Text style={{ color: "#777" }}>{ped.nome}</Text>
                        </View>
                      </View>

                      <Text style={{ fontWeight: "700", color: "#111" }}>
                        {money(ped.valorTotal)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
          {/* Botão de Enviar Fotos e Vídeos AQUI QUE ESTOU MEXENDO ------------------------------------------------------------------------------------------------- */}
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <TouchableOpacity
              onPress={handlePickMedia}
              disabled={uploading}
              style={{
                backgroundColor: uploading ? "#CCCCCC" : "#F2C94C",
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#111" />
                  <Text style={{ fontWeight: "700", fontSize: 16, color: "#111", marginLeft: 8 }}>
                    Enviando... {uploadProgress}%
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="cloud-upload-outline" size={20} color="#111" />
                  <Text style={{ fontWeight: "700", fontSize: 16, color: "#111", marginLeft: 8 }}>
                    Adicionar Fotos/Vídeos do Evento
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Texto de ajuda */}
            <Text style={{
              fontSize: 11,
              color: "#666",
              textAlign: 'center',
              marginTop: 5
            }}>
              Toque para selecionar fotos e vídeos
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{
              fontWeight: '700',
              fontSize: 16,
              marginBottom: 10,
              paddingHorizontal: 16
            }}>
              Galeria do Evento ({midias.length})
            </Text>

            <FlatList
              data={midias}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setModalVisible(true);
                  }}
                  style={{
                    width: (screenWidth - 48) / 3,
                    height: (screenWidth - 48) / 3,
                    margin: 2,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  {item.tipo === 'video' && (
                    <View style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 10,
                      padding: 3,
                    }}>
                      <Text style={{ color: 'white', fontSize: 10 }}>▶</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.9)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Botão fechar */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 80,
                  right: 20,
                  zIndex: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.32)",
                  borderRadius: 13,
                  padding: 10,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>

              {/* Botão excluir */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 80,
                  left: 20,
                  zIndex: 20,
                  backgroundColor: "rgba(255, 0, 0, 0.61)",
                  borderRadius: 20,
                  padding: 10,
                }}
                onPress={() =>
                  handleDeleteMedia(
                    midias[selectedImageIndex].id,
                    midias[selectedImageIndex].url
                  )
                }
              >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                  Excluir
                </Text>
              </TouchableOpacity>

              {/* Carrossel */}
              <FlatList
                data={midias}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.id)}
                initialScrollIndex={selectedImageIndex || 0}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth
                  );
                  setSelectedImageIndex(newIndex);
                }}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: screenWidth,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.tipo === "video" ? (
                      <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "white", marginBottom: 20 }}>
                          ⏯ Vídeo - Implemente o player conforme necessidade
                        </Text>

                        <Image
                          source={{ uri: item.url }}
                          style={{
                            width: screenWidth * 0.9,
                            height: screenWidth * 0.9,
                            borderRadius: 10,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: item.url }}
                        style={{
                          width: screenWidth * 0.9,
                          height: screenWidth * 0.9,
                          borderRadius: 10,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                )}
              />

              {/* Indicador */}
              <View
                style={{
                  position: "absolute",
                  bottom: 40,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 15,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>
                  {selectedImageIndex + 1} / {midias.length}
                </Text>
              </View>
            </View>
          </Modal>
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

              <TouchableOpacity
                onPress={() => setOrderOpen(false)}
                style={{ padding: 8 }}
              >
                <Ionicons name="close" size={18} color="#777" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title2}>Detalhes do Agendamento</Text>
            <Text style={styles.sub}>
              Veja as informações completas do pedido
            </Text>

            <ScrollView style={{ marginTop: 8 }}>
              {/* Nome e status */}
              <Text style={styles.label}>Evento</Text>
              <TextInput
                style={styles.inputDisabled}
                editable={false}
                value={pedidoSelecionado?.nome || ""}
              />

              <Text style={styles.label}>Status</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                {(() => {
                  const st = statusStyle(pedidoSelecionado?.status);
                  return (
                    <View
                      style={{
                        backgroundColor: st.bg,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ color: st.fg, fontWeight: "700" }}>
                        {st.label}
                      </Text>
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
                    ? `${toDateString(pedidoSelecionado.dataInicio)}${pedidoSelecionado.dataFim
                      ? ` — ${toDateString(pedidoSelecionado.dataFim)}`
                      : ""
                    }`
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
              {pedidoSelecionado?.itensAlugados &&
                pedidoSelecionado?.itensAlugados.length > 0 ? (
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
                      <Text style={{ color: "#222", fontWeight: "600" }}>
                        {it.nome || "Item"}
                      </Text>
                      <Text style={{ color: "#555" }}>
                        {money(it.precoAluguel)}
                      </Text>
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
  title: {
    textAlign: "center",
    color: "#111",
    fontWeight: "800",
    fontSize: 16,
  },
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
})

