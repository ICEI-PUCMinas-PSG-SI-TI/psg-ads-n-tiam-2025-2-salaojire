import React from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FirestoreTest from "./FirestoreTest";
import AuthTest from "./AuthTest"
import { ScrollView } from 'react-native';
export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView>
      <FirestoreTest></FirestoreTest>
      <AuthTest></AuthTest>
    </ScrollView>
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

