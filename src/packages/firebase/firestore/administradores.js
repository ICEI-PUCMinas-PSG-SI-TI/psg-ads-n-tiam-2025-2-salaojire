import { collection, doc, getDoc, updateDoc, addDoc, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
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