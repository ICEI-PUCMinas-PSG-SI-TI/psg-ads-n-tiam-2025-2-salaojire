import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import FirebaseAPI from "@packages/firebase";
import { firestore } from "@packages/firebase/config";
import ModalEditCreate from "../../components/ItemModalEditCreate";
import ModalDelete from "../../components/ItemModalDelete";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewSolicitacao() {
    const router = useRouter();
    const { solicitacaoId, clienteId } = useLocalSearchParams();
    
    const [loading, setLoading] = useState(true);
    const [solicitacao, setSolicitacao] = useState(null);
    const [cliente, setCliente] = useState(null);

    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

    const fetchData = async () => {
        try {
            if (!solicitacaoId || !clienteId) return;

            const clienteRef = doc(firestore, "Clientes", clienteId);
            const clienteSnap = await getDoc(clienteRef);
            
            const solRef = doc(firestore, "Clientes", clienteId, "solicitacoes", solicitacaoId);
            const solSnap = await getDoc(solRef);

            if (clienteSnap.exists() && solSnap.exists()) {
                setCliente(clienteSnap.data());
                setSolicitacao({ id: solSnap.id, ...solSnap.data() });
            } else {
                Alert.alert("Erro", "Solicitação não encontrada.");
                router.back();
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [solicitacaoId, clienteId]);

    const handleExcluirClick = (item) => {
        setItemSelecionado(item);
        setModalDeleteVisible(true);
    };

    const confirmDelete = async () => {
        try {
            
            await FirebaseAPI.firestore.clientes.removeItemEmSolicitacao(clienteId, solicitacaoId, itemSelecionado.id);
            
            Alert.alert("Sucesso", "Item removido da solicitação!");
            setModalDeleteVisible(false);
            setItemSelecionado(null);
            fetchData(); 
        } catch (error) {
            Alert.alert("Erro", "Não foi possível remover o item.");
            console.error(error);
        }
    };

    
    const handleEditarClick = (item) => {
        setItemSelecionado(item);
        setModalEditVisible(true);
    };

    //função modificado do componente modaleditcreate
    const customSaveFunction = async (dadosDoFormulario) => {
        try {
            
            const novosDados = {
                nome: dadosDoFormulario.nome,
                quantidade: dadosDoFormulario.quantidade,
                precoAluguel: dadosDoFormulario.precoAluguel, 
                descricao: dadosDoFormulario.descricao,
                imageUrl: dadosDoFormulario.imageUrl
            };

            await FirebaseAPI.firestore.clientes.updateItemEmSolicitacao(
                clienteId, 
                solicitacaoId, 
                itemSelecionado.id, 
                novosDados
            );

            Alert.alert("Sucesso", "Item da solicitação atualizado!");
            fetchData(); 
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao atualizar item.");
            throw error; 
        }
    };

    
    const formatarDataCompleta = (timestamp) => {
        if (!timestamp) return "-";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const dia = date.toLocaleDateString("pt-BR");
        const hora = date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
        return `${dia} - ${hora}`;
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#FFCC3C" style={styles.loadingContainer} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFCC3C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Solicitações</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                
                <Text style={styles.label}>Nome</Text>
                <View style={styles.readOnlyInput}><Text style={styles.readOnlyText}>{cliente?.nome}</Text></View>
                
                <Text style={styles.label}>Email</Text>
                <View style={styles.readOnlyInput}><Text style={styles.readOnlyText}>{cliente?.email}</Text></View>

                
                <Text style={styles.label}>Descrição</Text>
                <View style={[styles.whiteInput, styles.textArea]}>
                    <Text style={styles.inputText}>{solicitacao?.descricao}</Text>
                </View>

                <View style={{flexDirection:'row', gap: 10}}>
                    <View style={{flex:1}}>
                        <Text style={styles.label}>Início</Text>
                        <View style={styles.whiteInput}><Text style={styles.inputText}>{formatarDataCompleta(solicitacao?.dataInicio)}</Text></View>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.label}>Fim</Text>
                        <View style={styles.whiteInput}><Text style={styles.inputText}>{formatarDataCompleta(solicitacao?.dataFim)}</Text></View>
                    </View>
                </View>

                
                <Text style={[styles.label, { marginTop: 20 }]}>Itens solicitados:</Text>
                
                {solicitacao?.itensSolicitados && solicitacao.itensSolicitados.length > 0 ? (
                    solicitacao.itensSolicitados.map((item, index) => (
                        <View key={index} style={styles.itemCard}>
                            <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/60' }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle}>{item.nome}</Text>
                                <View style={styles.itemMeta}>
                                    <Text style={styles.itemQuantity}>{item.quantidade} un.</Text>
                                </View>
                            </View>
                            <View style={styles.itemActions}>
                                <TouchableOpacity onPress={() => handleEditarClick(item)}>
                                    <Ionicons name="pencil" size={20} color="#333" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleExcluirClick(item)} style={{marginLeft: 15}}>
                                    <Ionicons name="trash" size={20} color="#E53935" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhum item.</Text>
                )}

                <TouchableOpacity style={styles.confirmButton} onPress={() => Alert.alert("Em breve", "Converter para agendamento")}>
                    <Text style={styles.confirmButtonText}>Realizar agendamento</Text>
                </TouchableOpacity>

            </ScrollView>

            
            <ModalDelete
                visible={modalDeleteVisible}
                onCancel={() => setModalDeleteVisible(false)}
                onConfirm={confirmDelete}
                title="Remover item da solicitação?"
                subtitle="O item será removido apenas desta solicitação."
            />

            
            <ModalEditCreate
                visible={modalEditVisible}
                onClose={() => setModalEditVisible(false)}
                isEditing={true}
                itemData={itemSelecionado}
                customSubmit={customSaveFunction} 
                onSave={() => {}} //vazio, o refresh é feito dentro do custom fieto
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    header: { backgroundColor: "#000", paddingTop: 45, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    backButton: { marginRight: 15 },
    headerTitle: { color: "#FFCC3C", fontSize: 20, fontWeight: "bold" },
    scrollContent: { padding: 20, paddingBottom: 50 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#000", marginTop: 10 },
    readOnlyInput: { backgroundColor: "#D9D9D9", borderRadius: 8, padding: 15, borderWidth: 1, borderColor: "#CCC" },
    readOnlyText: { color: "#333", fontSize: 16 },
    whiteInput: { backgroundColor: "#FFF", borderRadius: 8, padding: 15, borderWidth: 1, borderColor: "#DDD" },
    textArea: { minHeight: 80 },
    inputText: { color: "#000", fontSize: 16 },
    itemCard: { backgroundColor: "#FFF", borderRadius: 10, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "#EEE", elevation: 2 },
    itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 15, backgroundColor: '#eee' },
    itemInfo: { flex: 1 },
    itemTitle: { fontWeight: 'bold', fontSize: 15 },
    itemQuantity: { fontSize: 12, color: '#666' },
    itemActions: { flexDirection: 'row', paddingRight: 5 },
    emptyText: { color: '#999', fontStyle: 'italic', marginTop: 5 },
    confirmButton: { marginTop: 30, alignItems: 'center', padding: 15 },
    confirmButtonText: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' }
});