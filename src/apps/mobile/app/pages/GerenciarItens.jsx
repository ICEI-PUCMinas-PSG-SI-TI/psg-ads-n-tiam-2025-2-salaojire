import { View, Text, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import FirebaseAPI from "@packages/firebase";
import ListaDeItens from "../../components/SectionList";
export default function Itens(){

    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");

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
    fetchItens();
  }, []);
  

    const voltar = () => {
              
    }
    
    
    const groupedItens = useMemo(() => {
        if (itens.length === 0) return [];

    const groups = itens.reduce((acc, item) => {
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
}, [itens]);

    return(
        <SafeAreaView>
            <StatusBar barStyle={"light-content"} backgroundColor={"black"}></StatusBar>
            <View style={styles.header}>
                 <Text style={styles.headerTitle}><Ionicons name="arrow-back" size={24} color="#FFD700" onPress={voltar}/>  Gerenciar itens</Text>     
                    <View style={styles.ContainerBusca}>
                        <Ionicons name="search" size={20} color="#FFD700" />
                        <TextInput
                         placeholder="Pesquisar por nome do item"
                         placeholderTextColor="#ccc"
                         style={styles.InputBusca}
                        />
                </View>
            </View>
            <View>
                <TouchableOpacity style={styles.Bottom}>
                    <Text style={styles.BottomText}>Adicionar novo</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />
            ) : (
                <ListaDeItens sections={groupedItens} />
            )}
        </SafeAreaView>
        
            
        
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
    color: "#ffd700ff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ContainerBusca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
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
  },

});