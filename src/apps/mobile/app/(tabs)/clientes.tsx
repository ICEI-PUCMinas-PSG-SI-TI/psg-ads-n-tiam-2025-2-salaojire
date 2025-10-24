import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ClientesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Área segura cobrindo o topo */}
      <View
        style={[
          styles.safeArea,
          { paddingTop: insets.top, backgroundColor: "#000" },
        ]}
      >
        {/* Scroll principal */}
        <ScrollView
          style={{ backgroundColor: "#fff" }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Visualizar Cliente</Text>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#fff" />
              <TextInput
                placeholder="Pesquisar por um cliente"
                placeholderTextColor="#ccc"
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Dados do cliente */}
          <View style={styles.section}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value="Melissa Peters"
              editable={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value="melpeters@gmail.com"
              editable={false}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value="(31) 98329-4563"
              editable={false}
            />
          </View>

          {/* Pedidos realizados */}
          <View style={styles.ordersContainer}>
            <View style={styles.ordersHeader}>
              <Text style={styles.ordersTitle}>PEDIDOS REALIZADOS</Text>
              <Text style={styles.ordersYear}>2025</Text>
            </View>

            {[
              { data: "07/10/2025", desc: "Festa de Aniversário", valor: "R$ 1200" },
              { data: "14/10/2025", desc: "Evento Corporativo", valor: "R$ 750" },
              { data: "17/10/2025", desc: "10 Jogos de Mesa", valor: "R$ 130" },
            ].map((pedido, index) => (
              <View key={index} style={styles.orderItem}>
                <Ionicons name="calendar-outline" size={20} color="#555" />
                <View style={styles.orderInfo}>
                  <Text style={styles.orderDate}>
                    {pedido.data} - <Text style={styles.orderStatus}>Pago</Text>
                  </Text>
                  <Text style={styles.orderDesc}>{pedido.desc}</Text>
                </View>
                <Text style={styles.orderValue}>{pedido.valor}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  // Cabeçalho
  header: {
    backgroundColor: "#000",
    padding: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6, 
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 45,
  },
  searchInput: {
    color: "#fff",
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },

  // Seções
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },

  // Pedidos
  ordersContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ordersTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  ordersYear: {
    color: "#777",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 10,
  },
  orderDate: {
    color: "#666",
    fontSize: 13,
  },
  orderStatus: {
    color: "green",
    fontWeight: "bold",
  },
  orderDesc: {
    color: "#333",
    fontSize: 15,
  },
  orderValue: {
    fontWeight: "bold",
    color: "#333",
  },
});