import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebase';

// Pegar todos os items
export async function getAll() {
  const itensCollection = collection(firestore, 'itens');
  const itensDocuments = await getDocs(itensCollection);
  const itensList = itensDocuments.docs.map(doc => ({ id: doc.id,...doc.data() }));
  return itensList;
}

// Pegar item com ID
export async function getById(id) {
  const itensRef = doc(firestore, 'itens', id);
  const itensDocuments = await getDoc(itensRef);
  if (itensDocuments.exists()) {
    return { id: itensDocuments.id,...itensDocuments.data() };
  } else {
    console.log("Nenhum item encontrado!");
    return null;
  }
}

// Criar item com imagem
export async function create(itemData, imageFile) {
  try {
    // Fazer upload da imagem
    const storageRef = ref(storage, `itens/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);

    const downloadURL = await getDownloadURL(storageRef);
    const item = {...itemData, imagemUrl: downloadURL };

    const itensCollection = collection(firestore, 'itens');
    const docRef = await addDoc(itensCollection, item);
    
    return { id: docRef.id,...item };
  } catch (error) {
    console.error("Erro ao criar item: ", error);
    return { error: "Falha ao criar o item." };
  }
}

// Atualiza um item existente
export async function update(id, updatedData, newImageFile = null) {
  try {
    let dataToUpdate = {...updatedData };

    if (newImageFile) {
      // Se houver uma nova imagem, faz o upload
      const storageRef = ref(storage, `itens/${Date.now()}_${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      dataToUpdate.imageUrl = await getDownloadURL(storageRef);
    }

    const pacoteRef = doc(db, 'itens', id);
    await updateDoc(pacoteRef, dataToUpdate); 
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar item: ", error);
    return { error: "Falha ao atualizar o item." };
  }
}