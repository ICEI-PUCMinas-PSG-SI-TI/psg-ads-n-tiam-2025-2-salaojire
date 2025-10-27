import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from "react-native";
import FirebaseAPI from "@packages/firebase"; 
import { router } from "expo-router";

const corDourada = '#F0B100';

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email) {
      setStatusMessage('Por favor, digite o email.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMessage('Por favor, digite um email válido.');
      return;
    }
  
    setIsLoading(true);
    setStatusMessage('');
  
    try {
      await FirebaseAPI.auth.sendResetEmail(email);
      setResetSent(true);
      setStatusMessage('✓ Email de redefinição enviado com sucesso!');
    } catch (error) {
      setStatusMessage('✓ Se o email estiver cadastrado, você receberá instruções em breve.');
      setResetSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setEmail("");
    setResetSent(false);
    setStatusMessage('');
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
            <View style={styles.inputGroup}>
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
                editable={!isLoading && !resetSent}
              />
            </View>

            {!resetSent ? (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={router.back}
                  disabled={isLoading}
                >
                  <Text style={styles.secondaryButtonText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleSendResetEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={corDourada} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Enviar Email</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.successMessage}>
                  <Text style={styles.successText}>
                    ✓ Solicitação processada com sucesso!
                  </Text>
                  <Text style={styles.instructionsText}>
                    {`Se o email ${email} estiver cadastrado em nosso sistema, você receberá instruções para redefinir sua senha.`}
                  </Text>
                  <Text style={styles.importantNote}>
                    • Verifique sua caixa de entrada
                    {"\n"}• Verifique a pasta de spam
                    {"\n"}• O link expira em 1 hora
                  </Text>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleNewSearch}
                  >
                    <Text style={styles.secondaryButtonText}>Novo Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={router.back}
                  >
                    <Text style={styles.primaryButtonText}>Voltar ao Login</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {statusMessage ? (
              <Text style={styles.statusText}>
                {statusMessage}
              </Text>
            ) : null}
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
  inputGroup: {
    marginBottom: 32,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#212121',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#212121',
  },
  primaryButtonText: {
    color: corDourada,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '600',
  },
  successMessage: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  instructionsText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 8,
  },
  importantNote: {
    color: '#1565C0',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  statusText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});