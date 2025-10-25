// Importando o SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTQVckQIsGxvxNpMp4_U29eU8utOe_nM4",
  authDomain: "salaojire.firebaseapp.com",
  projectId: "salaojire",
  storageBucket: "salaojire.firebasestorage.app",
  messagingSenderId: "925092363297",
  appId: "1:925092363297:web:644d64938b3707b6de3760",
};

// Inicializando
const app = initializeApp(firebaseConfig);

// Exportando instâncias do Firestore e Auth
export const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});;

export { auth };