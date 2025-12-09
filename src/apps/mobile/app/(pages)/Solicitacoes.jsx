import { View, Text, StyleSheet, TextInput, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FirebaseAPI from "@packages/firebase"; 
import { useAuth } from "../context/AuthContext"
import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { firestore } from "@packages/firebase/config";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Solicitacoes() {
    const router = useRouter();
    //const { user } = useAuth(); 
    
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [listaSolicitacoes, setListaSolicitacoes] = useState([]);

    useEffect(() => {
        fetchSolicitacoes();
    }, []);

    const fetchSolicitacoes = async () => {
        try {
            setLoading(true);
            const dados = await FirebaseAPI.firestore.clientes.getAllSolicitacoes();
            setListaSolicitacoes(dados);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível carregar as solicitações.");
        } finally {
            setLoading(false);
        }
    };

    const gerarDadosDeTeste = async () => {
        try {
            setLoading(true);

            
            const clienteRef = doc(firestore, "Clientes", "cliente_maria_01");
            
            await setDoc(clienteRef, {
                nome: "Maria",
                email: "mariaaparecida@gmail.com",
                telefone: "(31) 98789-4563",
                foto: null
            }, { merge: true });

            
            const solicitacoesRef = collection(firestore, "Clientes", "cliente_maria_01", "solicitacoes");
            
            
            const dataInicio = new Date(2025, 8, 10, 17, 0); // 10/09/2025 17:00
            const dataFim = new Date(2025, 8, 11, 23, 0);    // 11/09/2025 23:00

            await addDoc(solicitacoesRef, {
                dataSolicitacao: Timestamp.now(),
                dataInicio: Timestamp.fromDate(dataInicio),
                dataFim: Timestamp.fromDate(dataFim),
                descricao: "Eu quero fazer uma festa de aniversário, quanto estão os itens e o salão?",
                status: "pendente",
                itensSolicitados: [
                    {
                        id: "item_1",
                        nome: "Forro vermelho",
                        quantidade: 15,
                        imageUrl: null 
                    },
                    {
                        id: "item_2",
                        nome: "Piscina de Bolinhas",
                        quantidade: 1,
                        imageUrl: null
                    },
                    {
                        id: "item_3",
                        nome: "Cama Elástica",
                        quantidade: 1,
                        imageUrl: null
                    },
                    {
                        id: "item_4",
                        nome: "Cadeira",
                        quantidade: 60,
                        imageUrl: null
                    },
                    {
                        id: "item_5",
                        nome: "Mesa",
                        quantidade: 15,
                        imageUrl: null
                    }
                ]
            });

            Alert.alert("Sucesso", "Solicitação da Maria criada!");
            fetchSolicitacoes(); 

        } catch (error) {
            console.error("Erro ao gerar teste:", error);
            Alert.alert("Erro", "Falha ao criar dados: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const voltar = () => {
        if (router.canGoBack()) router.back();
    };

    const handleVisualizar = (item) => {
        
        router.push({
            pathname: "/ViewSolicitacao", 
            params: { 
                solicitacaoId: item.id, 
                clienteId: item.clienteId 
            }
        });
    };

    const calcularTempoDecorrido = (dataSolicitacao) => {
        if (!dataSolicitacao) return "-";
        const data = dataSolicitacao.toDate ? dataSolicitacao.toDate() : new Date(dataSolicitacao);
        const agora = new Date();
        const diffMs = agora - data;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHoras = Math.floor(diffMin / 60);
        const diffDias = Math.floor(diffHoras / 24);

        if (diffMin < 60) return `${diffMin} min`;
        if (diffHoras < 24) return `${diffHoras} h`; 
        return `${diffDias} d`;
    };

    const getInitials = (name) => {
        if (!name) return "AD"; 
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const listaFiltrada = useMemo(() => {
        if (!searchText) return listaSolicitacoes;
        
        return listaSolicitacoes.filter(item => 
            item.clienteNome.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.clienteEmail && item.clienteEmail.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [listaSolicitacoes, searchText]);

    {/*auth n funcionando para mostrar usuario logado, mexer no layout do tabs para englobar todo contexto das pages e tabs*/}
    
    /*<View style={styles.adminCard}>
                <View style={styles.featuredContent}>
                    <View style={[styles.avatarContainer, { backgroundColor: '#E0E0E0' }]}>
                        {}
                        <Text style={styles.avatarText}>{getInitials(user?.displayName || "Administrador")}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.nomeText}>
                            {user?.displayName || "Administrador"}
                        </Text>
                        <Text style={styles.emailText} numberOfLines={1}>
                            {user?.email}
                        </Text>
                        <Text style={styles.statusAdminText}>
                            ● Online
                        </Text>
                    </View>
                    
                    {}
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={20} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>*/
    const ListHeader = () => (
        <View style={styles.listHeaderContainer}>
            {}
            <TouchableOpacity 
                onPress={gerarDadosDeTeste}
                style={{ backgroundColor: '#FFD700', padding: 12, borderRadius: 8, marginBottom: 20, alignItems: 'center' }}
            >
                <Text style={{ fontWeight: 'bold', color: '#000' }}>
                    <Ionicons name="add-circle-outline" size={18} /> GERAR DADO DE TESTE
                </Text>
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mais recentes</Text>
                <Ionicons name="chevron-down" size={20} color="#FFD700" />
            </View>
        </View>
    );

    
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer} >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(item.clienteNome)}</Text>
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.nomeText}>{item.clienteNome}</Text>
                <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={14} color="#555" />
                    <Text style={styles.timeText}> {calcularTempoDecorrido(item.dataSolicitacao)}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => handleVisualizar(item)}>
                <Ionicons name="eye" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <StatusBar backgroundColor="#000000ff" barStyle="light-content" />
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={voltar} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFCC3C" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Solicitações</Text>
                </View>

                <View style={styles.ContainerBusca}>
                    <Ionicons name="search" size={20} color="#FFCC3C" />
                    <TextInput
                        placeholder="Pesquisar solicitação"
                        placeholderTextColor="#ccc"
                        style={styles.InputBusca}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={listaFiltrada}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={ListHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{textAlign:'center', marginTop: 20, color: '#999'}}>Nenhuma solicitação encontrada.</Text>
                    }
                />
            )}
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    header: {
        backgroundColor: "#000",
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 6,
        zIndex: 10,
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    backButton: { marginRight: 10 },
    headerTitle: { color: "#FFCC3C", fontSize: 20, fontWeight: "bold" },
    ContainerBusca: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#1C1C1C",
        borderRadius: 12, paddingHorizontal: 15, height: 50,
    },
    InputBusca: { color: "#fff", marginLeft: 10, flex: 1, fontSize: 16 },
    listContent: { paddingHorizontal: 20, paddingBottom: 80 },
    listHeaderContainer: { marginTop: 20, marginBottom: 10 },
    adminCard: {
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 15, 
        marginBottom: 25,
        borderWidth: 1, 
        borderColor: '#FFD700', 
        elevation: 3,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    featuredContent: { flexDirection: 'row', alignItems: 'center' },
    statusAdminText: { fontSize: 10, color: 'green', marginTop: 2 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 14, color: '#FFD700', fontWeight: '600', marginRight: 5 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff' },
    avatarContainer: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFD700',
        justifyContent: 'center', alignItems: 'center', marginRight: 15,
    },
    avatarText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
    infoContainer: { flex: 1 },
    nomeText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    emailText: { fontSize: 12, color: '#666', marginBottom: 2 },
    timeContainer: { flexDirection: 'row', alignItems: 'center' },
    timeText: { fontSize: 12, color: '#666' }
});