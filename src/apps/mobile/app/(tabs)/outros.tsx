import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AdminManagerScreen from "../(pages)/AdminManagerScreen";

export default function OutrosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outros</Text>
      <Text style={styles.text}>Esta seção abrirá um menu "Outros" eventualmente!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
