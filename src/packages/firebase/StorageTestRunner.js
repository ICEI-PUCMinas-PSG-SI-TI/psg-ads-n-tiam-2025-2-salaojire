// Salve este código como apps/mobile/src/StorageTestRunner.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import FirebaseAPI from '@packages/firebase';

const StorageTestRunner = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Observa o estado de autenticação em tempo real
  useEffect(() => {
    const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  },);

  const addLog = (message) => {
    console.log(message);
    setLogs([...logs, message]);
  };

  const runStorageTests = async () => {
    setIsLoading(true);
    setLogs([]);
    addLog('--- INICIANDO TESTE DE STORAGE (SEM ORQUESTRAÇÃO) ---');

    if (!user) {
      addLog('   => ERRO: Nenhum usuário autenticado. Faça login primeiro.');
      setIsLoading(false);
      return;
    }

    const clienteId = user.uid;
    // Para este teste, vamos assumir que um agendamento com este ID já existe.
    const agendamentoId = 'agendamento_teste_midia_123';
    let downloadURL = null;
    const midiaId = `midia_${Date.now()}`; // ID único para a mídia

    try {
      // --- ETAPA 1: UPLOAD PARA O CLOUD STORAGE ---
      addLog('\n - Interagindo com o Storage...');
      addLog('1. Criando um arquivo de teste em memória (Blob).');
      const mockFileContent = `Conteúdo de teste gerado em: ${new Date().toISOString()}`;
      const mockFile = new Blob([mockFileContent], { type: 'text/plain' });
      mockFile.name = `${midiaId}.txt`; // Adiciona a propriedade 'name' para simular um arquivo real
      
      const filePath = `agendamentos/${clienteId}/${agendamentoId}/${mockFile.name}`;
      addLog(`2. Chamando FirebaseAPI.storage.uploadFile para o caminho: ${filePath}`);

      downloadURL = await FirebaseAPI.storage.uploadFile(
        mockFile,
        filePath,
        (progress) => {
          addLog(`  ... Progresso do upload: ${progress.toFixed(2)}%`);
        }
      );
      addLog(`3. SUCESSO! Arquivo enviado. URL de download recebida.`);
      addLog(`   => URL: ${downloadURL.substring(0, 70)}...`);

      // --- ETAPA 2: VINCULAR URL AO FIRESTORE ---
      addLog('\n - Interagindo com o Firestore...');
      addLog('1. Preparando metadados da mídia para salvar.');
      const midiaData = {
        id: midiaId,
        url: downloadURL,
        descricao: 'Arquivo de teste gerado automaticamente',
        tipo: 'text/plain',
      };

      addLog('2. Chamando FirebaseAPI.firestore.clientes.addMidiaToAgendamento.');
      await FirebaseAPI.firestore.clientes.addMidiaToAgendamento(
        clienteId,
        agendamentoId,
        midiaData
      );
      addLog('3. SUCESSO! Metadados da mídia salvos no documento do agendamento.');

    } catch (error) {
      addLog(`   => ERRO INESPERADO: ${error.message}`);
    } finally {
      // --- ETAPA DE LIMPEZA (SE TUDO DEU CERTO) ---
      if (downloadURL) {
        addLog('\n--- Limpeza: Removendo dados de teste ---');
        try {
          // Primeiro, remove o registro do Firestore
          addLog('1. Removendo metadados do Firestore...');
          await FirebaseAPI.firestore.clientes.removeMidiaFromAgendamento(
            clienteId,
            agendamentoId,
            midiaId
          );
          addLog('   => SUCESSO! Metadados removidos.');

          // Depois, remove o arquivo do Storage
          addLog('2. Removendo arquivo do Cloud Storage...');
          await FirebaseAPI.storage.deleteFileByUrl(downloadURL);
          addLog('   => SUCESSO! Arquivo deletado.');
        } catch (error) {
          addLog(`   => ERRO na limpeza: ${error.message}`);
        }
      }
      addLog('\n--- TESTES CONCLUÍDOS ---');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Testador de Storage + Firestore</Text>
        <Text style={styles.statusText}>
          Status: {user? `Logado como ${user.email}` : 'Deslogado (Faça login!)'}
        </Text>
        <Button
          title="Executar Testes de Storage e Firestore"
          onPress={runStorageTests}
          disabled={isLoading ||!user}
        />
      </View>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      <ScrollView style={styles.logContainer} contentContainerStyle={styles.logContent}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {`[${index + 1}] ${log}`}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  statusText: { textAlign: 'center', marginBottom: 12, color: 'gray', fontWeight: 'bold' },
  loader: { marginVertical: 20 },
  logContainer: { flex: 1, padding: 10 },
  logContent: { paddingBottom: 20 },
  logText: { fontFamily: Platform.OS === 'ios'? 'Menlo' : 'monospace', fontSize: 12, color: '#333', marginBottom: 4 },
});

export default StorageTestRunner;