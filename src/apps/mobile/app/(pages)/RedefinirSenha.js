import React, { useState } from "react";
import {StyleSheet,View,Text,Image,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,SafeAreaView,ScrollView,ActivityIndicator} from "react-native";

import FirebaseAPI from "@packages/firebase"; 
import { router } from "expo-router";

const corDourada = '#F0B100';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setStatusMessage('Por favor, preencha o email e a senha.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      await FirebaseAPI.auth.signIn(email, password);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexOne}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/LogoJire.png')}
              accessibilityLabel="Logo JIRÉ"
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Redefinir Senha</Text>

          <View style={styles.form}>
            <View style={styles.inputGroupEmail}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite o seu email..."
                placeholderTextColor="#969696"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={router.back} disabled={isLoading}>
                <Text style={styles.forgotPasswordText}>
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>

            {statusMessage ? (
              <Text style={styles.errorText}>{statusMessage}</Text>
            ) : null}

            <View style={styles.submitButtonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSignIn}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={corDourada} />
                ) : (
                  <Text style={styles.submitButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logoContainer: {
    marginBottom: 24,
    marginTop: 32,
  },
  logo: {
    width: 200,
    height: 89,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 16,
  },
  inputGroupEmail: {
    marginBottom: 32,
  },
  inputGroupPassword: {
    marginBottom: 12,
  },
  label: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: corDourada,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButtonContainer: {
    alignItems: 'center',
  },
  submitButton: {
    width: 285,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  submitButtonText: {
    color: corDourada,
    fontSize: 20,
    fontWeight: '600',
  },
});