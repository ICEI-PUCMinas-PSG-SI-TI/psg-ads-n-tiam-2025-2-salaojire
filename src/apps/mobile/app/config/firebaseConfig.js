import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDTQVckQIsGxvxNpMp4_U29eU8utOe_nM4",
  authDomain: "salaojire.firebaseapp.com",
  projectId: "salaojire",
  storageBucket: "salaojire.firebasestorage.app",
  messagingSenderId: "925092363297",
  appId: "1:925092363297:web:644d64938b3707b6de3760",
};
const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app); // Web
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage), // Mobile (Expo/React Native)
  });
}

export { app, auth };