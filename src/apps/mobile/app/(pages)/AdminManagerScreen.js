import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase"
import AdminModal from "../../components/AdminModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useRouter } from "expo-router";

export default function AdminManagerScreen() {
  const router = useRouter();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAdmins = async () => {
    try {
      const data = await FirebaseAPI.firestore.administradores.getAdmins();
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

  const filteredAdmins = admins.filter((admin) =>
    admin.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAdmin = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleDeleteAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await FirebaseAPI.firestore.administradores.deleteAdminProfile(selectedAdmin.id);
      setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.log("Erro ao excluir admin:", error);
    }
  };

  const refreshList = () => {
    loadAdmins();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f9b500" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar administradores</Text>

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
                  <Ionicons name="pencil" size={22} color="#0f0f0fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAdmin(item)}>
                  <Ionicons name="trash" size={22} color="rgba(8, 8, 8, 1)" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.divButtomAdd }>
      <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
        <Text style={styles.addButtonText}>+ Adicionar admin</Text>
      </TouchableOpacity>
      </View>

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

AdminManagerScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 25,
    zIndex: 1,
  },
  title: {
    marginLeft: 40,
    fontSize: 20,
    fontWeight: "700",
    color: "#ffd700ff",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 45,
  },
  searchIcon: {
    marginRight: 25,
  },
  searchInput: {
    flex: 1,
    color: "#eeeeeeff",
  },
  adminItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffd700ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#070707ff",
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
    backgroundColor: "#ffd700ff",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    margin: 100,
    marginTop: 25,
  },
  addButtonText: {
    color: "#000000ff",
    fontSize: 16,
    fontWeight: "bold",
  },

});
