import { Button } from "@react-navigation/elements";
import { View, Text, StyleSheet } from "react-native";
import FirebaseAPI from "@packages/firebase";
import { useAuth } from "../context/AuthContext";

export default function HomepageScreen() {
  const { user, initializing, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homepage</Text>
      <Text style={styles.text}>Aqui ficará a homepage do aplicativo.</Text>
      <Text>Logado atualmente como: {user.email}</Text>
      <Button onPress={logout}>Logout</Button>
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