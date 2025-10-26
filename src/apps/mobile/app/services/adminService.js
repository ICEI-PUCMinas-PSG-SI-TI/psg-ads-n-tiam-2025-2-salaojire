// src/apps/mobile/app/services/adminService.js
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore as db } from "../../../../packages/firebase/config"; 
// Ajuste os ../ se necessário, dependendo da posição do arquivo

// Buscar admins
export async function getAdmins() {
  try {
    const querySnapshot = await getDocs(collection(db, "admins"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar admins:", error);
    throw error;
  }
}

// Criar admin
export async function createAdmin(data) {
  try {
    await addDoc(collection(db, "admins"), data);
  } catch (error) {
    console.error("Erro ao salvar admin:", error);
    throw error;
  }
}

// Atualizar admin
export async function updateAdmin(id, data) {
  try {
    const ref = doc(db, "admins", id);
    await updateDoc(ref, data);
  } catch (error) {
    console.error("Erro ao atualizar admin:", error);
    throw error;
  }
}

// Excluir admin
export async function deleteAdmin(id) {
  try {
    const ref = doc(db, "admins", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Erro ao deletar admin:", error);
    throw error;
  }
}
