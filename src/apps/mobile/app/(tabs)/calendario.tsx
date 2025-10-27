import { View, Text, StyleSheet } from "react-native";
import GerenciarAdmin from "../(pages)/AdminManagerScreen";

export default function OutrosScreen() {
  return (
    <GerenciarAdmin></GerenciarAdmin>
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
