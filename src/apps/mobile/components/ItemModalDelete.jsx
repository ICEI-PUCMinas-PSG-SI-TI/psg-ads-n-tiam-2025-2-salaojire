import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function ConfirmDeleteModal({ visible, onConfirm, onCancel, title, subtitle }) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Ionicons name="trash-outline" size={60} color="#FFD700" style={styles.icon} />

                    <Text style={styles.title}>
                        {title || "Você tem certeza?"}
                    </Text>

                    <Text style={styles.subtitle}>{subtitle || "Confirme a sua opção"}</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}>
                            <Text style={styles.confirmText}>Sim</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}>
                            <Text style={styles.cancelText}>Não</Text>
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
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#1d1d1dff",
        borderRadius: 16,
        padding: 25,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFD700"
    },
    icon: {
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#ccc",
        marginBottom: 25,
    },
    buttonsContainer: {
        flexDirection: "row",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 8,
    },
    confirmButton: {
        backgroundColor: "#E53935", 
    },
    cancelButton: {
        backgroundColor: "#FFD700",
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
});