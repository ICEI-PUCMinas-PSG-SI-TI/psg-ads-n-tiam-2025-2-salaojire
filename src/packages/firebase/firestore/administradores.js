import { collection, doc, getDoc, updateDoc, addDoc, deleteDoc, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../config';

//Lembrem de usar try e catch quando for usar a API

/* Busca os dados de um admin específico. Exemplo:
const admin = await FirebaseAPI.firestore.administradores.getAdmin(AdminID);
*/
export async function getAdmin(adminId) {
  const docRef = doc(firestore, 'Administradores', adminId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

/* Pega todos admins. Exemplo:
const admins = await FirebaseAPI.firestore.administradores.getAdmins();
*/
export async function getAdmins() {
  const docRef = collection(firestore, 'Administradores');
  const querySnapshot = await getDocs(docRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* Atualiza os dados do perfil de um administrador. Exemplo:
await FirebaseAPI.firestore.administradores.updateAdminProfile(adminId, { nome: "Alterado" });
const updatedAdmin = await FirebaseAPI.firestore.administradores.getAdmin(adminId);
*/
export async function updateAdminProfile(adminId, dataToUpdate) {
  try {
    const adminDocRef = doc(firestore, 'Administradores', adminId);
    await updateDoc(adminDocRef, dataToUpdate);
  } catch (error) {
    console.error("Erro ao atualizar perfil do administrador:", error);
    throw new Error('Falha ao atualizar o perfil do administrador.');
  }
}

// Precisa atualizar para excluir no authentication também
/* Exclui o documento de perfil de um administrador do Firestore. Exemplo:
await FirebaseAPI.auth.deleteAdminProfile(adminId);
*/
export async function deleteAdminProfile(adminId) {
  try {
    const adminDocRef = doc(firestore, 'Administradores', adminId);
    await deleteDoc(adminDocRef);
  } catch (error) {
    console.error("Erro ao excluir perfil do administrador:", error);
    throw new Error('Falha ao excluir o perfil do administrador.');
  }
}