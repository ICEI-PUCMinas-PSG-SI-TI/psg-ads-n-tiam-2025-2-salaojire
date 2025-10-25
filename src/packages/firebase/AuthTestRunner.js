// Salve este código como apps/mobile/src/AuthTestRunner.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
// Certifique-se de que o caminho de importação está correto para sua estrutura
import FirebaseAPI from '@packages/firebase';

const AuthTestRunner = () => {
  // Estado para os campos de input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para controlar o status de carregamento e o usuário atual
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  
  // Estado para exibir mensagens de status/erro
  const [statusMessage, setStatusMessage] = useState('');

  // Efeito para escutar mudanças no estado de autenticação em tempo real
  useEffect(() => {
    // A função onAuthStateChanged retorna uma função 'unsubscribe'
    const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Limpa o listener quando o componente é desmontado
    return unsubscribe;
  },);

  const handleSignUp = async () => {
    if (!email ||!password) {
      setStatusMessage('Por favor, preencha e-mail e senha.');
      return;
    }
    setIsLoading(true);
    setStatusMessage('');
    try {
      // Dados de exemplo para o cadastro de cliente
      const clienteData = {
        email: email,
        senha: password,
        nome: 'Cliente de Teste',
        telefone: '123456789',
      };
      await FirebaseAPI.auth.signUpCliente(clienteData);
      setStatusMessage('Cadastro realizado com sucesso! Usuário logado.');
      // O onAuthStateChanged irá atualizar o estado do 'user' automaticamente
    } catch (error) {
      setStatusMessage(`Erro no cadastro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email ||!password) {
      setStatusMessage('Por favor, preencha e-mail e senha.');
      return;
    }
    setIsLoading(true);
    setStatusMessage('');
    try {
      await FirebaseAPI.auth.signIn(email, password);
      setStatusMessage('Login realizado com sucesso!');
      // O onAuthStateChanged irá atualizar o estado do 'user' automaticamente
    } catch (error) {
      setStatusMessage(`Erro no login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setStatusMessage('');
    try {
      await FirebaseAPI.auth.signOut();
      setStatusMessage('Usuário deslogado com sucesso.');
      // Limpa os campos após o logout
      setEmail('');
      setPassword('');
    } catch (error) {
      setStatusMessage(`Erro ao sair: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Enquanto o Firebase verifica o estado inicial de autenticação, exibe um loader
  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Renderiza a UI de acordo com o estado de autenticação (logado ou não)
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Testador de Autenticação</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Status:</Text>
        {user? (
          <Text style={styles.statusText}>Logado como: {user.email}</Text>
        ) : (
          <Text style={styles.statusText}>Não autenticado</Text>
        )}
      </View>

      {statusMessage? <Text style={styles.logText}>{statusMessage}</Text> : null}
      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      {!user? (
        // UI para usuário deslogado
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Cadastrar Cliente" onPress={handleSignUp} disabled={isLoading} />
            <Button title="Login" onPress={handleSignIn} disabled={isLoading} />
          </View>
        </View>
      ) : (
        // UI para usuário logado
        <View style={styles.buttonContainer}>
          <Button title="Sair (Sign Out)" onPress={handleSignOut} disabled={isLoading} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
    width: '80%',
    gap: 10,
  },
  loader: {
    marginVertical: 20,
  },
  logText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default AuthTestRunner;