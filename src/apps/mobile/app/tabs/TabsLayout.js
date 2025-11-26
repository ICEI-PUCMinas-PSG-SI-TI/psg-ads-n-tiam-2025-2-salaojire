import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from 'expo-navigation-bar';

import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  AppState
} from "react-native";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../(pages)/login";

const TAB_BG = "#000000";
const GOLD = "#FFD700";
const GOLD_DARK = "#B8860B";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth >= 768;

function MenuItem({ icon, label, onPress }) {
  return (
    <View>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.menuIconCircle}>
          <Ionicons name={icon} size={18} color={GOLD} />
        </View>
        <Text style={styles.menuItemLabel}>{label}</Text>
      </TouchableOpacity>
      <View style={styles.menuDivider} />
    </View>
  );
}

export default function TabLayout() {
  const { user, initializing, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, []);
  
  if (initializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const raw = user.email?.split("@")[0] ?? "";
  const firstName = raw
    ? raw.charAt(0).toUpperCase() + raw.slice(1)
    : "Usuário";
  const email = user.email ?? "email@naoencontrado.com";

  function handleMenuItemPress(key) {
    setMenuOpen(false);

    const routes = {
      agendamentos: "/gerenciarAgendamentos",
      itens: "/(pages)/GerenciarItens",
      admins: "/AdminManagerScreen",
      solicitacoes: "/(pages)/Solicitacoes",
      config: "/configuracoes",
    };

    if (key === "sair") {
      logout();
    } else if (routes[key]) {
      router.push(routes[key]);
    }
  }

  const renderTabIcon = (name, focused) => (
    <View
      style={[
        styles.tabIconCircle,
        { backgroundColor: focused ? GOLD : "transparent" },
      ]}
    >
      <Ionicons
        name={name}
        size={isSmallScreen ? 18 : 22}
        color={focused ? "#000" : GOLD_DARK}
        style={{ marginBottom: 2 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: GOLD,
          tabBarInactiveTintColor: GOLD_DARK,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Homepage",
            tabBarIcon: ({ focused }) => renderTabIcon("home", focused),
          }}
        />
        <Tabs.Screen
          name="calendario"
          options={{
            title: "Calendário",
            tabBarIcon: ({ focused }) => renderTabIcon("calendar", focused),
          }}
        />
        <Tabs.Screen
          name="relatorios"
          options={{
            title: "Relatórios",
            tabBarIcon: ({ focused }) =>
              renderTabIcon("document-text", focused),
          }}
        />
        <Tabs.Screen
          name="clientes"
          options={{
            title: "Clientes",
            tabBarIcon: ({ focused }) => renderTabIcon("people", focused),
          }}
        />
        <Tabs.Screen
          name="gerenciarAgendamentos"
          options={{
            title: "Agendamentos",
            tabBarIcon: ({ focused }) =>
              renderTabIcon("alarm-outline", focused),
          }}
        />

        <Tabs.Screen
          name="outros"
          options={{
            title: "Outros",
            tabBarIcon: ({ focused }) => renderTabIcon("menu", focused),
            tabBarButton: (props) => {
              const { onPress, ...restProps } = props;
              return (
                <Pressable
                  {...restProps}
                  onPress={(e) => {
                    e.preventDefault();
                    setMenuOpen(true);
                  }}
                >
                  {props.children}
                </Pressable>
              );
            },
          }}
        />
      </Tabs>

      {menuOpen && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuOpen(false)}
          />

          <View style={styles.menuSheet}>
            <View style={styles.menuHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.menuName}>{firstName}</Text>
                <Text style={styles.menuEmail} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            </View>

            <View style={styles.menuList}>
              <MenuItem
                icon="lock-closed-outline"
                label="Agendamentos"
                onPress={() => handleMenuItemPress("agendamentos")}
              />
              <MenuItem
                icon="cube-outline"
                label="Itens"
                onPress={() => handleMenuItemPress("itens")}
              />
              <MenuItem
                icon="people-circle-outline"
                label="Administradores"
                onPress={() => handleMenuItemPress("admins")}
              />
              <MenuItem
                icon="chatbubble-ellipses-outline"
                label="Solicitações"
                onPress={() => handleMenuItemPress("solicitacoes")}
              />
              <MenuItem
                icon="settings-outline"
                label="Configurações"
                onPress={() => handleMenuItemPress("config")}
              />
              <MenuItem
                icon="log-out-outline"
                label="Sair"
                onPress={() => handleMenuItemPress("sair")}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  tabBar: {
    backgroundColor: TAB_BG,
    borderTopColor: "#222",
    height: isSmallScreen ? 60 : 72,
    paddingBottom: isSmallScreen ? 6 : 10,
    paddingTop: isSmallScreen ? 2 : 4,
    position: "absolute",
  },
  tabBarLabel: {
    fontSize: isSmallScreen ? 9 : 11,
    fontWeight: "600",
    marginTop: 0,
  },
  tabIconCircle: {
    width: isSmallScreen ? 30 : 38,
    height: isSmallScreen ? 30 : 38,
    borderRadius: isSmallScreen ? 15 : 19,
    justifyContent: "center",
    alignItems: "center",
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  menuSheet: {
    width: isTablet ? screenWidth * 0.35 : screenWidth * 0.8,
    maxWidth: 400,
    height: screenHeight * 0.9,
    alignSelf: "center",
    backgroundColor: "#F0B100",
    borderTopLeftRadius: isSmallScreen ? 30 : 40,
    borderBottomLeftRadius: isSmallScreen ? 30 : 40,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingTop: isSmallScreen ? 20 : 26,
    paddingBottom: isSmallScreen ? 18 : 24,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: -2, height: 0 },
    elevation: 8,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarCircle: {
    width: isSmallScreen ? 44 : 50,
    height: isSmallScreen ? 44 : 50,
    borderRadius: isSmallScreen ? 22 : 25,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "800",
    color: "#000",
  },
  menuName: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: "700",
    color: "#000",
  },
  menuEmail: {
    fontSize: isSmallScreen ? 11 : 12,
    color: "#333",
    marginTop: 2,
    maxWidth: screenWidth * 0.5,
  },
  menuList: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isSmallScreen ? 8 : 10,
  },
  menuIconCircle: {
    width: isSmallScreen ? 32 : 36,
    height: isSmallScreen ? 32 : 36,
    borderRadius: isSmallScreen ? 16 : 18,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  menuItemLabel: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: "600",
    color: "#000",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#000",
    opacity: 0.2,
  },
});
