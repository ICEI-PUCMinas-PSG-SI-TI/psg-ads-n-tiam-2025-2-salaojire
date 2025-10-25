import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../config';

/* Busca um documento de qualquer coleção e retorna seus dados. */
export async function getDocument(collectionPath, docId) {
  const docRef = doc(firestore, collectionPath, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()? { id: docSnap.id,...docSnap.data() } : null;
}