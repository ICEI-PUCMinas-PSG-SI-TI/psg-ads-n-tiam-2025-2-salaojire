// Salve este código como apps/mobile/src/FirestoreTestRunner.js

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
// Certifique-se de que o caminho de importação está correto para sua estrutura
import FirebaseAPI from '@packages/firebase';

const FirestoreTestRunner = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // CORREÇÃO: Estado para armazenar o usuário autenticado
  const [user, setUser] = useState(null);

  // CORREÇÃO: Efeito para escutar o estado de autenticação em tempo real
  useEffect(() => {
    // A função onAuthStateChanged retorna uma função para cancelar a inscrição (unsubscribe)
    const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    // Limpa o listener quando o componente é desmontado
    return unsubscribe;
  },);

  const addLog = (message) => {
    console.log(message);
    setLogs([...logs, message]);
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setLogs();
    addLog('--- INICIANDO SUÍTE DE TESTES DO FIRESTORE ---');

    await testItensCollection();
    await testClientesAndSubcollections();

    addLog('\n--- TESTES CONCLUÍDOS ---');
    setIsLoading(false);
  };

  const testItensCollection = async () => {
    addLog('\n--- Módulo: Coleção "Itens" ---');
    let itemId = null;
    try {
      addLog('1. Criando novo item...');
      const newItemData = {
        nome: 'Cadeira Gamer de Teste',
        categoria: 'Móveis',
        precoAluguel: 99.9,
        descricao: 'Item gerado automaticamente para teste.',
        imagemUrl: 'http://example.com/cadeira.png',
      };
      // Assumindo que as regras permitem escrita por usuários autenticados ou admins
      itemId = await FirebaseAPI.firestore.itens.createItem(newItemData);
      addLog(`   => SUCESSO! Item criado com ID: ${itemId}`);

      addLog('2. Lendo todos os itens da coleção...');
      const itens = await FirebaseAPI.firestore.itens.getItens();
      addLog(`   => SUCESSO! ${itens.length} itens encontrados.`);

      addLog('3. Lendo o item específico recém-criado...');
      const item = await FirebaseAPI.firestore.itens.getItem(itemId);
      addLog(`   => SUCESSO! Lido item: "${item.nome}"`);

      addLog('4. Atualizando o preço do item...');
      await FirebaseAPI.firestore.itens.updateItem(itemId, { precoAluguel: 110.5 });
      const updatedItem = await FirebaseAPI.firestore.itens.getItem(itemId);
      addLog(`   => SUCESSO! Preço atualizado para: ${updatedItem.precoAluguel}`);

    } catch (error) {
      addLog(`   => ERRO INESPERADO: ${error.message}`);
    } finally {
      if (itemId) {
        addLog('5. Limpeza: Deletando item de teste...');
        try {
          await FirebaseAPI.firestore.itens.deleteItem(itemId);
          addLog('   => SUCESSO! Item de teste deletado.');
        } catch (error) {
          addLog(`   => ERRO na limpeza: ${error.message}`);
        }
      }
    }
  };

  const testClientesAndSubcollections = async () => {
    addLog('\n--- Módulo: Coleção "Clientes" e Subcoleções ---');
    
    // CORREÇÃO: Verifica se há um usuário logado antes de prosseguir
    if (!user) {
      addLog('   => ERRO: Nenhum usuário autenticado. Testes de cliente pulados.');
      addLog('   => DICA: Use o "AuthTestRunner" para logar ou cadastrar um usuário primeiro.');
      return;
    }

    // CORREÇÃO: Usa o UID do usuário autenticado, o que funcionará com as regras de segurança
    const TEST_CLIENT_ID = user.uid;
    addLog(`AVISO: Usando ID do cliente autenticado: ${TEST_CLIENT_ID}.`);
    
    let solicitacaoId = null;

    try {
      addLog('1. Adicionando um "agendamento" na subcoleção do cliente...');
      const novaSolicitacao = {
    dataInicio: new Date(),
    dataFim: new Date(),
    dataSolicitacao: Date.now(),
    descricao: "Descrição aqui",
    itensSolicitados: [],
};
solicitacaoId = await FirebaseAPI.firestore.clientes.addSolicitacaoToCliente(TEST_CLIENT_ID, novaSolicitacao);
      addLog(`   => SUCESSO! Agendamento criado com ID: ${solicitacaoId}`);

      addLog('2. Lendo todos os agendamentos do cliente...');
  const solicitacoes = await FirebaseAPI.firestore.clientes.getSolicitacoesFromCliente(TEST_CLIENT_ID);
  console.log(solicitacoes);
      addLog(`   => SUCESSO! Encontrados ${solicitacoes.length} agendamentos.`);

      addLog('3. Adicionando um item ao array "itensAlugados" do agendamento...');
      const itemSolicitado = { id: 'item_xyz_012', precoUnitario: 300 };
await FirebaseAPI.firestore.clientes.addItemToSolicitacao(TEST_CLIENT_ID, solicitacaoId, itemSolicitado);
      addLog('   => SUCESSO! Item adicionado com arrayUnion.');

      addLog('4. Atualizando o preço do item dentro do array "itensAlugados"...');
      await FirebaseAPI.firestore.clientes.updateItemEmSolicitacao(TEST_CLIENT_ID, solicitacaoId, 'item_xyz_012', { precoUnitario: 100 });
      addLog('   => SUCESSO! Item atualizado (padrão ler-modificar-escrever).');

    } catch (error) {
      addLog(`   => ERRO: ${error.message}`);
      addLog('   => DICA: Se o erro for "permission-denied", verifique suas Regras de Segurança e se o usuário está autenticado.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Testador da API Firestore</Text>
        <Text style={styles.statusText}>
          Status: {user? `Logado como ${user.email}` : 'Deslogado'}
        </Text>
        <Button
          title="Executar Testes do Firestore"
          onPress={runAllTests}
          disabled={isLoading}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 12,
    color: 'gray',
  },
  loader: {
    marginVertical: 20,
  },
  logContainer: {
    flex: 1,
    padding: 10,
  },
  logContent: {
    paddingBottom: 20,
  },
  logText: {
    fontFamily: Platform.OS === 'ios'? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
});

export default FirestoreTestRunner;