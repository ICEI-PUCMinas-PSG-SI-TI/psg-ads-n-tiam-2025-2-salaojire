import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LocalizacaoWeb() {
  //colocar aqui as coordenadas reais do salao de festa
  const latitude = -19.923242;
  const longitude = -43.934123;

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Localização do nosso Salão de Festas</Text>

        <div style={styles.mapWrapper}>
          <iframe
            style={styles.iframe}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
          ></iframe>
        </div>

        <Text style={styles.footerText}>
          Clique em "Ver map maior" para ser direcionado ao Google Maps.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    backgroundColor: "#e9d30fff",
  },

  card: {
    width: "90%",
    maxWidth: 900,
    backgroundColor: "#ececec93",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.81)",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  mapWrapper: {
    width: "100%",
    height: 450,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0px 2px 40px rgba(48, 45, 7, 0.4)",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: 10,
  },

  footerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#444",
    fontSize: 14,
  },
});
