import React from 'react';
import { SectionList, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const ItemCard = ({ item, onEdit, onDelete }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/50' }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.nome}</Text>
            {}
            <Text style={styles.itemQuantity}>1 unidade</Text> 
        </View>
        <View style={styles.itemActions}>
            <TouchableOpacity onPress={onEdit}>
                <Ionicons name="pencil" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }} onPres={onDelete}>
                <Ionicons name="trash" size={24} color="#E53935" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function ListaDeItens({ sections , onEdit, onDelete}) {
    return (
        <SectionList
            sections={sections} 
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ItemCard 
            item={item} 
            onEdit={()=>onEdit(item)}
            onDelete={()=>onDelete(item)}
            />}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
        />
    );
}



const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#F5F5F5'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
        elevation: 2,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#eee',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});