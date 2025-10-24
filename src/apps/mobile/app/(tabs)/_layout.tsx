import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#222",
          height: 70,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#B8860B",
      }}
    >
      {/* Homepage */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Homepage",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#FFD700" : "transparent",
              }}
            >
              <Ionicons
                name="home"
                size={22}
                color={focused ? "#000" : "#B8860B"}
              />
            </View>
          ),
        }}
      />

      {/* Calendário */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Calendário",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#FFD700" : "transparent",
              }}
            >
              <Ionicons
                name="calendar"
                size={22}
                color={focused ? "#000" : "#B8860B"}
              />
            </View>
          ),
        }}
      />

      {/* Relatórios */}
      <Tabs.Screen
        name="relatorios"
        options={{
          title: "Relatórios",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#FFD700" : "transparent",
              }}
            >
              <Ionicons
                name="document-text"
                size={22}
                color={focused ? "#000" : "#B8860B"}
              />
            </View>
          ),
        }}
      />

      {/* Clientes */}
      <Tabs.Screen
        name="clientes"
        options={{
          title: "Clientes",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#FFD700" : "transparent",
              }}
            >
              <Ionicons
                name="people"
                size={22}
                color={focused ? "#000" : "#B8860B"}
              />
            </View>
          ),
        }}
      />

      {/* Outros */}
      <Tabs.Screen
        name="outros"
        options={{
          title: "Outros",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#FFD700" : "transparent",
              }}
            >
              <Ionicons
                name="menu"
                size={22}
                color={focused ? "#000" : "#B8860B"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}