// app/tabs/outros.tsx
import React from "react";
import { View } from "react-native";

export default function OutrosPlaceholder() {
  // Essa tela nunca é realmente usada, o menu é um overlay no TabsLayout
  // A correção acima impede que esta rota seja navegada ao clicar no botão "Outros"
  return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
}