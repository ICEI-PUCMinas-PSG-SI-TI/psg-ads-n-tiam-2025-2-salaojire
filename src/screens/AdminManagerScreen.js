import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAdmins, deleteAdmin, } from "../services/adminService";
import AdminModal from "../components/AdminModal"; // será feito na etapa 3
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"; // etapa 4

export default function AdminManagerScreen() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); //barra pesquisa 

  // Carregar admins do Firebase
  const loadAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.log("Erro ao buscar admins:", error);
      Alert.alert("Erro", "Não foi possível carregar os administradores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  //Filtro barra de pesquisa
  const filteredAdmins = admins.filter((admin) =>
    admin.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Abrir modal de novo admin
  const handleAddAdmin = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
    setShowModal(true);
  };

  // Abrir modal de edição
  const handleEditAdmin = (admin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  // Abrir modal de exclusão
  const handleDeleteAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  // Confirmar exclusão
  const confirmDelete = async () => {
    try {
      await deleteAdmin(selectedAdmin.id);
      setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.log("Erro ao excluir admin:", error);
    }
  };

  // Atualizar lista após salvar
  const refreshList = () => {
    loadAdmins();
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color="#f9b500" />
  </TouchableOpacity>
  <Text style={styles.title}>Gerenciar administradores</Text>

        {/*  Barra de pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#f9b500" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por um administrador"
            placeholderTextColor="#726e6eff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f9b500" />
      ) : (
        <FlatList
          data={filteredAdmins}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.adminItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.nome[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.adminName}>{item.nome}</Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEditAdmin(item)}>
                  <Ionicons name="pencil" size={22} color="#f9b500" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAdmin(item)}>
                  <Ionicons name="trash" size={22} color="#f00" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
        <Text style={styles.addButtonText}>+ Adicionar admin</Text>
      </TouchableOpacity>

      {/* Modais */}
      {showModal && (
        <AdminModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSave={refreshList}
          isEditing={isEditing}
          adminData={selectedAdmin}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
  position: "absolute",
  left: 20,
  top: 50,
  zIndex: 1,
},
  header: {
    backgroundColor: "#000", // fundo preto
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    marginLeft: 40,
    fontSize: 20,
    fontWeight: "700",
    color: "#f9b500", 
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222", // fundo barra pesquisa 
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 45,
  },
  searchIcon: {
    marginRight: 25,
  },
  searchInput: {
    flex: 1,
    color: "#fff", // texto da barra de pesquisa branco
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  adminItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9b500",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  adminName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  addButton: {
    backgroundColor: "#f9b500",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    margin: 50,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

