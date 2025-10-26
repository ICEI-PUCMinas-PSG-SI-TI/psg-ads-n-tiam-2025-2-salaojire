import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase"

export default function AdminModal({
    visible,
    onClose,
    onSave,
    isEditing,
    adminData,
}) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nivel, setNivel] = useState("ADMIN");

    useEffect(() => {
        if (isEditing && adminData) {
            setNome(adminData.nome);
            setEmail(adminData.email);
            setSenha(adminData.senha || "");
            setNivel(adminData.nivel || "ADMIN")
        } else {
            setNome("");
            setEmail("");
            setSenha("");
            setNivel("ADMIN")
        }
    }, [isEditing, adminData]);

    const handleSave = async () => {
        if (!nome || !email || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        const regras = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regras.test(senha)) {
            Alert.alert(
                "Senha inválida",
                "A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo."
            );
            return;
        }


        try {
            if (isEditing) {
                await FirebaseAPI.firestore.administradores.updateAdminProfile(adminData.id, { nome, email, senha, nivel });
                Alert.alert("Sucesso", "Administrador atualizado com sucesso!");
            } else {
                await FirebaseAPI.auth.signUpAdmin({ nome, email, senha, nivel });
                Alert.alert("Sucesso", "Administrador cadastrado com sucesso!");
            }

            onSave(); // Atualiza lista
            onClose(); // Fecha modal
        } catch (error) {
            console.log("Erro ao salvar admin:", error);
            Alert.alert("Erro", "Ocorreu um problema ao salvar os dados.");
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>

                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={isEditing ? "create-outline" : "person-add-outline"}
                            size={60}
                            color="#f9b500"
                        />
                    </View>

                    <Text style={styles.title}>
                        {isEditing ? "Editar Administrador" : "Cadastrar Administrador"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isEditing
                            ? "Altere as informações necessárias"
                            : "Adicione as informações necessárias"}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite o nome"
                        placeholderTextColor="#4d4c4cff"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o email"
                        placeholderTextColor="#4d4c4cff"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite uma senha"
                        placeholderTextColor="#4d4c4cff"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />

                    <Text style={styles.passwordHint}>
                        Deve ter pelo menos 8 caracteres, com 1 minúsculo, maiúsculo e
                        especial.
                    </Text>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>
                            {isEditing ? "Salvar" : "Cadastrar"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/*Opcões de nivel de admin */}
            <View style={styles.nivelContainer}>
            <View style={{ width: "100%", margin: 3 }}>
                <Text style={{ color: "#333", fontSize: 18, marginBottom: 5, fontWeight: "600" }}>
                    Nível de administração:
                </Text>
                <View style={{ flexDirection: "row", marginVertical: 20 }}>
                    <TouchableOpacity
                        style={[
                            styles.nivelButton,
                            nivel === "SUPER" && styles.nivelSelected,
                        ]}
                        onPress={() => setNivel("SUPER")}>
                        <Text style={nivel === "SUPER" ? { color: "#fff" } : { color: "#333" }}>
                            SUPER
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.nivelButton,
                            nivel === "ADMIN" && styles.nivelSelected,
                        ]}
                        onPress={() => setNivel("ADMIN")}>
                        <Text style={nivel === "ADMIN" ? { color: "#fff" } : { color: "#333" }}>
                            ADMIN
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.59)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    iconContainer: {
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 10,
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#f9b500",
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        backgroundColor: "#e7e5e5ff",
        color: "#000000ff",
        padding: 10,
        borderRadius: 10,
        marginVertical: 6,
    },
    passwordHint: {
        fontSize: 12,
        color: "#777",
        marginBottom: 10,
    },
    saveButton: {
        width: "100%",
        backgroundColor: "#f9b500",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 5,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#555",
        fontWeight: "500",
    },
    nivelButton: {
        flex: 1,
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#e7e6e6ff",
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
    },
    nivelSelected: {
        backgroundColor: "#f9b500",
    },
    nivelContainer: {
  width: "100%",
  backgroundColor: "#fff",
  borderTopWidth: 1,
  borderTopColor: "#ddd",
  marginTop: 20,
  paddingVertical: 10,
  borderRadius: 8,
},

nivelLabel: {
  color: "#333",
  fontSize: 15,
  fontWeight: "600",
  marginLeft: 10,
  marginBottom: 5,
},

nivelRow: {
  flexDirection: "row",
  justifyContent: "center",
},

});
