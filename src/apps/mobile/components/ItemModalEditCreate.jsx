import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase"; 

export default function ItemModal({ visible, onClose, onSave, isEditing, itemData }) {
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [valorBase, setValorBase] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (isEditing && itemData) { 
            setNome(itemData.nome || "");
            setQuantidade(itemData.quantidade?.toString() || "");
            setValorBase(itemData.precoAluguel?.toString() || ""); 
            setDescricao(itemData.descricao || "");
        } else {
            
            setNome("");
            setQuantidade("");
            setValorBase("");
            setDescricao("");
        }
    }, [isEditing, itemData]);

    const Salvar = async () => {
        if (!nome || !quantidade || !valorBase || !descricao) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        
        const dadosItem = {
            nome,
            quantidade: parseInt(quantidade, 10),
            precoAluguel: parseFloat(valorBase),
            descricao,
            imageUrl: imageUrl,
            
        };

        try {
            if (isEditing) {
                await FirebaseAPI.firestore.itens.updateItem(itemData.id, dadosItem);
                Alert.alert("Sucesso", "Item atualizado com sucesso!");
            } else {
                await FirebaseAPI.firestore.itens.createItem(dadosItem);
                Alert.alert("Sucesso", "Item cadastrado com sucesso!");
            }
            onSave();  
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar o item:", error);
            Alert.alert("Erro", "Não foi possível salvar o item.");
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={28} color="#b1b1b1ff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.imagePicker}>
                            <Ionicons name="camera-outline" size={50} color="#000000ff" />
                        </TouchableOpacity>

                        <Text style={styles.title}>{isEditing ? "Editar Item" : "Cadastrar Item"}</Text>
                        <Text style={styles.subtitle}>{isEditing ? "Altere as informações necessárias" : "Adicione as informações necessárias"}</Text>

                        <TextInput style={styles.input} placeholder="Digite o Nome do item" placeholderTextColor="#9b9b9bff" value={nome} onChangeText={setNome} />
                        <TextInput style={styles.input} placeholder="Digite a Quantidade disponível" placeholderTextColor="#9b9b9bff" keyboardType="numeric" value={quantidade} onChangeText={setQuantidade} />
                        <TextInput style={styles.input} placeholder="Digite o Valor base de aluguel" placeholderTextColor="#9b9b9bff" keyboardType="numeric" value={valorBase} onChangeText={setValorBase} />
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Digite a Descrição do item" placeholderTextColor="#9b9b9bff" multiline value={descricao} onChangeText={setDescricao} />

                        <TouchableOpacity style={styles.saveButton} onPress={Salvar}>
                            <Text style={styles.saveButtonText}>{isEditing ? "Salvar Alterações" : "Cadastrar"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        width: '100%'
    },
    modalContainer: {
        width: 'auto',
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        padding: 5,
        top: 15,
        right: 15,
    },
    imagePicker: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ffffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#000000ff',
        borderStyle: 'solid',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000ff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#9b9b9bff',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#ffffffff',
        borderColor: '#b1b1b1ff',
        borderWidth: 1,
        color: '#000000ff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        width: '100%',
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 15,
        borderColor: '#636363ff',
        borderWidth: 1,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        
    },
    cancelButtonText: {
        color: '#636363ff',
        fontSize: 18,
        fontWeight: 'bold',
        
    },
});