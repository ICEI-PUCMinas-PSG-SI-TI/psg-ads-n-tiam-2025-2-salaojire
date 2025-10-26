import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminManagerScreen from "../(pages)/AdminManagerScreen";

export type RootStackParamList = {
  Home: undefined;
  AdminManager: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Tela inicial com botão estilizado
function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminManager")}
      >
        <Text style={styles.buttonText}>Gerenciar Admins</Text>
      </TouchableOpacity>
    </View>
  );
}

// Componente principal do app
const App: React.FC = () => {
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "" }} />
        <Stack.Screen
          name="AdminManager"
          component={AdminManagerScreen}
          options={{ title: "Gerenciar Admins" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40, // Para afastar do topo da tela
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FFD700", // amarelo
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
