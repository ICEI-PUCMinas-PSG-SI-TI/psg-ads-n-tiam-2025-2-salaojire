import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export default {
  auth,
  storage,
  firestore: {
    administradores,
    clientes,
    itens,
  },
};
