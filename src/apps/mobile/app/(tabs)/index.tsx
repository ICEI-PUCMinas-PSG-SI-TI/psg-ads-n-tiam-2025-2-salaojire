import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

import { firestore } from '@packages/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function App() {

  const handleTestFirebase = async () => {
    try {
      console.log('Tentando escrever no Firestore...');
      
      const testDocRef = doc(firestore, 'testes', 'conexao-teste');

      await setDoc(testDocRef, {
        status: 'conectado com sucesso!',
        timestamp: new Date(),
        teste: true,
      });

      console.log('Escrita no Firestore realizada com sucesso!');
      Alert.alert('Sucesso!', 'A conexão com o Firebase funcionou e os dados foram escritos.');

    } catch (error) {
      console.error("Erro ao escrever no Firestore: ", error);
      Alert.alert('Erro!', 'Não foi possível conectar ao Firebase. Verifique o console para mais detalhes.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Conexão Firebase</Text>
      <Text style={styles.instructions}>
        Clique no botão abaixo para tentar escrever um documento no Firestore.
      </Text>
      <Button
        title="Testar Conexão com Firebase"
        onPress={handleTestFirebase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
});