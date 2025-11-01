import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firestore } from '../config';

//Lembrem de usar try e catch quando for usar a API

/* Cria um novo item. Exemplo:
const newItemData = {
  nome: 'Cadeira Gamer de Teste',
  categoria: 'Móveis',
  precoAluguel: 99.9,
  descricao: 'Item gerado automaticamente para teste.',
  imagemUrl: 'http://example.com/cadeira.png',
};
itemId = await FirebaseAPI.firestore.itens.createItem(newItemData);
*/
export async function createItem(itemData) {
  const itemsRef = collection(firestore, 'Itens');
  const docRef = await addDoc(itemsRef, itemData);
  return docRef.id;
}

/* Recebe o item com ID especifico. Exemplo:
const itens = await FirebaseAPI.firestore.itens.getItens();
*/
export async function getItem(itemId) {
  const docRef = doc(firestore, 'Itens', itemId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()? { id: docSnap.id,...docSnap.data() } : null;
}

/* Pega todos os itens de uma categoria. Exemplo:
const item = await FirebaseAPI.firestore.itens.getItem(itemId);
*/
export async function getItens(categoria) {
  const itemsRef = collection(firestore, 'Itens');
  let q;
  if (categoria) {
    q = query(itemsRef, where('categoria', '==', categoria));
  } else {
    q = query(itemsRef);
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
}

/* Atualiza um item com um novo dado. Exemplo:
await FirebaseAPI.firestore.itens.updateItem(itemId, { precoAluguel: 110.5 });
const updatedItem = await FirebaseAPI.firestore.itens.getItem(itemId);
*/
export async function updateItem(itemId, dataToUpdate) {
  const itemRef = doc(firestore, 'Itens', itemId);
  await updateDoc(itemRef, dataToUpdate);
}

/* Remove um item. Exemplo:
await FirebaseAPI.firestore.itens.deleteItem(itemId);
*/
export async function deleteItem(itemId) {
  const itemRef = doc(firestore, 'Itens', itemId);
  await deleteDoc(itemRef);
}