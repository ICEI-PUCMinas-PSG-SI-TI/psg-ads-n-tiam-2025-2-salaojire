import React from 'react';
import { Tabs, Redirect } from "expo-router"; // 1. Importar Redirect
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from '../context/AuthContext';
import LoginPage from '../(pages)/(Login)/login';

export default function TabLayout() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Se o usuário não está logado, redirecionar para página de login
  if (!user) {
    return (
    <LoginPage></LoginPage>
    )
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#222",
          height: 90,
          paddingBottom: 20,
          paddingTop: 1,
          position: "absolute",
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
                style={{ marginBottom: 5 }}
              />
            </View>
          ),
        }}
      />

      {/* Calendário */}
      <Tabs.Screen
        name="calendario"
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
                style={{ marginBottom: 5 }}
              />
            </View>
          ),
        }}
      />

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
                style={{ marginBottom: 5 }}
              />
            </View>
          ),
        }}
      />

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
                style={{ marginBottom: 5 }}
              />
            </View>
          ),
        }}
      />

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
                style={{ marginBottom: 5 }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}