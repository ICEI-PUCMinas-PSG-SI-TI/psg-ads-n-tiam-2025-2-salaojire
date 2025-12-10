import { View, Text, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FirebaseAPI from "@packages/firebase";
import ListaDeItens from "../../components/SectionList";
import ModalEditCreate from "../../components/ItemModalEditCreate";
import ModalDelete from "../../components/ItemModalDelete";
import { useRouter } from "expo-router";

export default function Itens() {
    const router = useRouter(); 

    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isItemModalVisivel, setItemModalVisivel] = useState(false);
    const [isDeleteModalVisivel, setDeleteModalVisivel] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [itemAtual, setItemAtual] = useState(null);

    const fetchItens = async () => {
        try {
            const itensList = await FirebaseAPI.firestore.itens.getItens();
            setItens(itensList);
        } catch (error) {
            console.error("Erro ao buscar itens", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItens();
    }, []);


    const voltar = () => {
        router.push("/"); 
    }

    const groupedItens = useMemo(() => {
        const filteredItens = itens.filter(item =>
            item.nome.toLowerCase().startsWith(searchText.toLowerCase())
        );

        if (filteredItens.length === 0) return [];

        const groups = filteredItens.reduce((acc, item) => {
            const { categoria } = item;
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(item);
            return acc;
        }, {});

        return Object.keys(groups).map(categoria => ({
            title: categoria,
            data: groups[categoria],
        }));
    }, [itens, searchText]);

    const Criar = () => {
        setIsEditing(false);
        setItemAtual(null);
        setItemModalVisivel(true);
    };

    const Editar = (item) => {
        setIsEditing(true);
        setItemAtual(item);
        setItemModalVisivel(true);
    };

    const Excluir = (item) => {
        setItemAtual(item);
        setDeleteModalVisivel(true);
    };
    const confirmDelete = async () => {
        if (!itemAtual) return;
        try {
            await FirebaseAPI.firestore.itens.deleteItem(itemAtual.id);
            Alert.alert("Sucesso", "Item excluído!");
            setDeleteModalVisivel(false);
            fetchItens();
        } catch (error) {
            console.error("Erro ao excluir o item:", error);
            Alert.alert("Erro", "Não foi possível excluir o item.");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <StatusBar backgroundColor="#000000ff" barStyle="light-content" />
            <View style={styles.header}>
                <View style={styles.headerTop}>
                <TouchableOpacity onPress={voltar} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFCC3C" />
                    </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Gerenciar itens
                </Text>
                </View>
                <View style={styles.ContainerBusca}>
                    <Ionicons name="search" size={20} color="#FFCC3C" />
                    <TextInput
                        placeholder="Pesquisar por nome do item"
                        placeholderTextColor="#ccc"
                        style={styles.InputBusca}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>
            <View>
                <TouchableOpacity style={styles.Bottom} onPress={Criar}>
                    <Text style={styles.BottomText}>Adicionar novo</Text>
                </TouchableOpacity>
            </View>
            
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />
            ) : (
                <ListaDeItens sections={groupedItens} onEdit={Editar} onDelete={Excluir} title={"Lista de Itens:"}
                />
            )}

            <ModalEditCreate
                visible={isItemModalVisivel}
                onClose={() => setItemModalVisivel(false)}
                onSave={() => { fetchItens(); }}
                isEditing={isEditing}
                itemData={itemAtual}
            >
            </ModalEditCreate>
            <ModalDelete
                visible={isDeleteModalVisivel}
                onCancel={() => setDeleteModalVisivel(false)}
                onConfirm={confirmDelete}
                title="Você tem certeza que deseja excluir este item?"
                subtitle="Confirme a sua opção"
            ></ModalDelete>
        </SafeAreaView>    
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
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
    headerTop: { 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15 },
    backButton: { 
        marginRight: 10 
    },
    headerTitle: { 
        color: "#FFCC3C", 
        fontSize: 20, 
        fontWeight: "bold" 
    },
    ContainerBusca: {
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#1C1C1C",
        borderRadius: 12, 
        paddingHorizontal: 15,
         height: 50,
    },
    InputBusca: { 
        color: "#fff", 
        marginLeft: 10, 
        flex: 1, 
        fontSize: 16 
    },
    Bottom: {
        backgroundColor: "#FFCC3C",
        height: 40,
        width: 150,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
        marginRight: 20,
        margin: 20,
    },
    BottomText: {
        fontSize: 17,
        fontWeight: "bold",
        

    },

});