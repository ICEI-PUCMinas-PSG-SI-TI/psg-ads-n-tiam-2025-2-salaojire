import { db } from "../config/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

const adminCollection = collection(db, "administradores");

// Listar todos
export const getAdmins = async () => {
  const snapshot = await getDocs(adminCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Criar novo
export const createAdmin = async (adminData) => {
  await addDoc(adminCollection, adminData);
};

// Editar existente
export const updateAdmin = async (id, newData) => {
  const adminRef = doc(db, "administradores", id);
  await updateDoc(adminRef, newData);
};

// Excluir
export const deleteAdmin = async (id) => {
  const adminRef = doc(db, "administradores", id);
  await deleteDoc(adminRef);
};
