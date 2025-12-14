import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCLrDUzbKLz4emHo1Y8443IcIYm15u3X1A",
  authDomain: "primeiroprojeto-65a93.firebaseapp.com",
  projectId: "primeiroprojeto-65a93",
  storageBucket: "primeiroprojeto-65a93.firebasestorage.app",
  messagingSenderId: "813681861529",
  appId: "1:813681861529:web:4314b672324b3c20fd2908"
};

console.log(`Conectado ao banco de dados: ${firebaseConfig.projectId}`)
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);