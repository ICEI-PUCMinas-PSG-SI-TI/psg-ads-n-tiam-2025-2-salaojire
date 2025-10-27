import { Button } from "@react-navigation/elements";
import { View, Text, StyleSheet } from "react-native";
import FirebaseAPI from "@packages/firebase";
import Gerenciaritens from "../pages/GerenciarItens";
import GerenciarAdmin from "../(pages)/AdminManagerScreen";

export default function HomepageScreen() {
  return (
    <Gerenciaritens></Gerenciaritens>
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