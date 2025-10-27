import React from 'react';
import { Slot } from 'expo-router';
import AuthProvider from '../context/AuthContext';
import TabLayout from '../tabs/TabsLayout';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TabLayout></TabLayout>
    </AuthProvider>
  );
}