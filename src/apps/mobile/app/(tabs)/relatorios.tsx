import { View, Text, StyleSheet } from "react-native";
import GerenciarItens from "../(pages)/GerenciarItens"

export default function RelatoriosScreen() {
  return (
    <GerenciarItens></GerenciarItens>
  )
  /*return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      <Text style={styles.text}>Aqui você poderá visualizar relatórios e estatísticas do salão.</Text>
    </View>
  );*/
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
