import { collection, collectionGroup, doc, getDoc, updateDoc, addDoc, deleteDoc, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../config';

//Lembrem de usar try e catch quando for usar a API

/* Pega todos os clientes. Exemplo:
const clientes = await FirebaseAPI.firestore.clientes.getClientes();
*/
export async function getClientes() {
  const docRef = collection(firestore, 'Clientes');
  const querySnapshot = await getDocs(docRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* Busca os dados de um cliente específico. Exemplo:
const cliente = await FirebaseAPI.firestore.clientes.getCliente(ClienteID);
*/
export async function getCliente(clienteId) {
  const docRef = doc(firestore, 'Clientes', clienteId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

/* Busca um cliente pelo campo 'email'. Exemplo:
const cliente = await FirebaseAPI.firestore.clientes.getClientePorEmail("joao@email.com");
*/
export async function getClientePorEmail(email) {
  try {
    const clientesRef = collection(firestore, 'Clientes');
    const q = query(clientesRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };

  } catch (error) {
    console.error("Erro ao buscar cliente por email:", error);
    return null;
  }
}

/* Atualiza os dados do perfil de um cliente no Firestore. Exemplo:
await FirebaseAPI.firestore.clientes.updateClienteProfile(clienteId, { nome: "Alterado" });
const updatedCliente = await FirebaseAPI.firestore.clientes.getCliente(clienteId);
*/
export async function updateClienteProfile(clienteId, dataToUpdate) {
  try {
    const userDocRef = doc(firestore, 'Clientes', clienteId);
    await updateDoc(userDocRef, dataToUpdate);
  } catch (error) {
    console.error("Erro ao atualizar perfil do cliente:", error);
    throw new Error('Falha ao atualizar o perfil do cliente.');
  }
}

// Precisa atualizar para remover no authentication também
/* Exclui o documento de perfil de um cliente do Firestore. Exemplo:
await FirebaseAPI.auth.deleteClienteProfile(clienteId);
*/
export async function deleteClienteProfile(clienteId) {
  try {
    const userDocRef = doc(firestore, 'Clientes', clienteId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Erro ao excluir perfil do cliente:", error);
    throw new Error('Falha ao excluir o perfil do cliente.');
  }
}

// AGENDAMENTOS

/* Busca TODOS os agendamentos de TODOS os clientes, 
retorna o objeto do agendamento + o ID do Cliente (pai) para podermos editar/excluir depois. Exemplo:
const listaAgendamentos = await FirebaseAPI.firestore.clientes.getAllAgendamentos();
*/
export async function getAllAgendamentos() {
  try {
    const agendamentosQuery = collectionGroup(firestore, 'agendamentos');
    const querySnapshot = await getDocs(agendamentosQuery);
    
    return querySnapshot.docs.map(doc => {
      const clienteId = doc.ref.parent.parent ? doc.ref.parent.parent.id : null;
      
      return { 
        id: doc.id, 
        clienteId: clienteId,
        ...doc.data() 
      };
    });
  } catch (error) {
    console.error("Erro ao buscar todos os agendamentos:", error);
    throw new Error("Falha ao buscar agendamentos gerais.");
  }
}

/* Adiciona um novo agendamento a um cliente. Exemplo:
const novoAgendamento = {
    dataInicio: new Date(),
    dataFim: new Date(),
    status: 'agendado',
    valorTotal: 350,
    itensAlugados: [],
    midias: []
};
agendamentoId = await FirebaseAPI.firestore.clientes.addAgendamentoToCliente(IDCliente, novoAgendamento);
*/
export async function addAgendamentoToCliente(clienteId, agendamentoData) {
  const dataCorrigida = {
  ...agendamentoData,
    itensAlugados: agendamentoData.itensAlugados || [],
    midias: agendamentoData.Midias || [],
  };
  const agendamentosRef = collection(firestore, 'Clientes', clienteId, 'agendamentos');
  const docRef = await addDoc(agendamentosRef, dataCorrigida);
  return docRef.id;
}

/* Busca todos os agendamentos de um cliente. Exemplo:
const agendamentos = await FirebaseAPI.firestore.clientes.getAgendamentosFromCliente(IDCliente);
console.log(agendamentos);
*/
export async function getAgendamentosFromCliente(clienteId) {
  const agendamentosRef = collection(firestore, 'Clientes', clienteId, 'agendamentos');
  const querySnapshot = await getDocs(agendamentosRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}



/***************************************************************************/

export async function updateAgendamento(clienteId, agendamentoId, dataToUpdate) {
  try {
    const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);
    await updateDoc(agendamentoRef, dataToUpdate);
    console.log("Agendamento atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    throw new Error("Falha ao atualizar agendamento.");
  }
}


/* 
***************************************************************************/


// ========== EXCLUIR AGENDAMENTO ==========
export async function deleteAgendamento(clienteId, agendamentoId) {
  try {
    const agendamentoRef = doc(firestore, "Clientes", clienteId, "agendamentos", agendamentoId);
    await deleteDoc(agendamentoRef);
    console.log(" Agendamento excluído com sucesso no Firestore!");
  } catch (error) {
    console.error(" Erro ao excluir agendamento:", error);
    throw new Error("Falha ao excluir agendamento.");
  }
}

/***************************************************************************/




/* Adiciona um item ao array 'itensAlugados' de um agendamento específico. Exemplo:
const itemAlugado = { id: 'item_xyz_789', precoUnitario: 150 };
await FirebaseAPI.firestore.clientes.addItemToAgendamento(ClienteID, agendamentoId, itemAlugado);
*/
export async function addItemToAgendamento(clienteId, agendamentoId, itemData) {
  const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);
  await updateDoc(agendamentoRef, {
    itensAlugados: arrayUnion(itemData)
  });
}

/* Atualiza um item específico dentro do array 'itensAlugados' de um agendamento. Exemplo:
await FirebaseAPI.firestore.clientes.updateItemEmAgendamento(ClienteID, agendamentoId, 'item_xyz_789', { precoUnitario: 165 });
*/
export async function updateItemEmAgendamento(clienteId, agendamentoId, itemIdToUpdate, newItemData) {
  const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);

  const agendamentoSnap = await getDoc(agendamentoRef);
  if (!agendamentoSnap.exists()) {
    throw new Error("Agendamento não encontrado.");
  }

  const agendamento = agendamentoSnap.data();
  const itensAlugados = agendamento.itensAlugados;
  const updatedItens = itensAlugados.map(item => {
    if (item.id === itemIdToUpdate) {
      return { ...item, ...newItemData };
    }
    return item;
  });

  await updateDoc(agendamentoRef, {
    itensAlugados: updatedItens
  });
}

/* Remove um item específico do array 'itensAlugados' de um agendamento. Exemplo:
await FirebaseAPI.firestore.clientes.removeItemEmAgendamento(ClienteID, agendamentoId, 'item_xyz_789');
*/
export async function removeItemEmAgendamento(clienteId, agendamentoId, itemIdToRemove) {
  const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);

  const agendamentoSnap = await getDoc(agendamentoRef);
  if (!agendamentoSnap.exists()) {
    throw new Error("Agendamento não encontrado.");
  }

  const agendamento = agendamentoSnap.data();
  const itens = agendamento.itensAlugados || [];
  const updatedItens = itens.filter(item => item.id!== itemIdToRemove);

  await updateDoc(agendamentoRef, {
    itensAlugados: updatedItens
  });
}

// MIDIAS

/* Adiciona uma nova mídia ao array 'Midias' de um agendamento específico. Exemplo:
const novaMidia = {
    descricao: "Descricao da midia",
    tipo: "imagem",
    url: './exemplo.img',
};
midiaId = await FirebaseAPI.firestore.clientes.addMidiaToAgendamento(IDCliente, agendamentoId, novaMidia);
*/
export async function addMidiaToAgendamento(clienteId, agendamentoId, midiaData) {
  const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);
  await updateDoc(agendamentoRef, {
    midias: arrayUnion(midiaData)
  });
}

/* Atualiza uma mídia específica dentro do array 'Midias' de um agendamento. Exemplo:
await FirebaseAPI.firestore.clientes.updateMidiaEmAgendamento(ClienteID, agendamentoId, midiaId, { url: "./exemplo2.img" });
*/
export async function updateMidiaEmAgendamento(clienteId, agendamentoId, midiaIdToUpdate, newMidiaData) {
  const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);

  const agendamentoSnap = await getDoc(agendamentoRef);
  if (!agendamentoSnap.exists()) {
    throw new Error("Agendamento não encontrado.");
  }

  const agendamento = agendamentoSnap.data();
  const midias = agendamento.Midias || [];
  const updatedMidias = midias.map(midia => {
    if (midia.id === midiaIdToUpdate) {
      return {...midia,...newMidiaData };
    }
    return midia;
  });

  await updateDoc(agendamentoRef, {
    midias: updatedMidias
  });
}

/* Remove uma mídia específica do array 'Midias' de um agendamento. Exemplo:
await FirebaseAPI.firestore.clientes.removeMidiaFromAgendamento(ClienteID, agendamentoId, midiaId);
*/
export async function removeMidiaFromAgendamento(clienteId, agendamentoId, midiaIdToRemove) {
  const agendamentoRef = doc(firestore, 'Clientes', clienteId, 'agendamentos', agendamentoId);

  const agendamentoSnap = await getDoc(agendamentoRef);
  if (!agendamentoSnap.exists()) {
    throw new Error("Agendamento não encontrado.");
  }

  const agendamento = agendamentoSnap.data();
  const midias = agendamento.Midias || [];
  const updatedMidias = midias.filter(midia => midia.id!== midiaIdToRemove);

  await updateDoc(agendamentoRef, {
    midias: updatedMidias
  });
}

// SOLICITAÇÕES

/* Adiciona uma nova solicitação a um cliente. Exemplo:
const novaSolicitacao = {
    dataInicio: new Date(),
    dataFim: new Date(),
    dataSolicitacao: Date.now(),
    descricao: "Descrição aqui",
    itensSolicitados: [],
};
solicitacaoId = await FirebaseAPI.firestore.clientes.addSolicitacaoToCliente(IDCliente, novaSolicitacao);
*/
export async function addSolicitacaoToCliente(clienteId, solicitacaoData) {
  const solicitacoesRef = collection(firestore, 'Clientes', clienteId, 'solicitacoes');
  const docRef = await addDoc(solicitacoesRef, solicitacaoData);
  return docRef.id;
}

/* Busca todas as solicitações de um cliente. Exemplo:
const solicitacoes = await FirebaseAPI.firestore.clientes.getSolicitacoesFromCliente(IDCliente);
console.log(solicitacoes);
*/
export async function getSolicitacoesFromCliente(clienteId) {
  const solicitacoesRef = collection(firestore, 'Clientes', clienteId, 'solicitacoes');
  const querySnapshot = await getDocs(solicitacoesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAllSolicitacoes() {
  try {
    const solicitacoesQuery = collectionGroup(firestore, 'solicitacoes');
    const querySnapshot = await getDocs(solicitacoesQuery);
    
    const solicitacoesPromises = querySnapshot.docs.map(async (solicitacaoDoc) => {
      const solicitacaoData = solicitacaoDoc.data();
      
      const clienteDocRef = solicitacaoDoc.ref.parent.parent;
      let clienteData = { nome: 'Desconhecido', email: '' };

      if (clienteDocRef) {
        const clienteSnap = await getDoc(clienteDocRef);
        if (clienteSnap.exists()) {
          clienteData = clienteSnap.data();
        }
      }

      return { 
        id: solicitacaoDoc.id, 
        clienteId: clienteDocRef ? clienteDocRef.id : null,
        clienteNome: clienteData.nome || "Cliente Sem Nome",
        clienteEmail: clienteData.email || "",
        ...solicitacaoData 
      };
    });

    const results = await Promise.all(solicitacoesPromises);
    
    return results.sort((a, b) => {
        const dataA = a.dataSolicitacao?.toDate ? a.dataSolicitacao.toDate() : new Date(a.dataSolicitacao);
        const dataB = b.dataSolicitacao?.toDate ? b.dataSolicitacao.toDate() : new Date(b.dataSolicitacao);
        return dataB - dataA;
    });

  } catch (error) {
    console.error("Erro ao buscar todas as solicitações:", error);
    throw new Error("Falha ao buscar solicitações gerais.");
  }
}

/* Adiciona um item ao array 'itensSolicitados' de uma solicitação específica. Exemplo:
const itemSolicitado = { id: 'item_xyz_012', precoUnitario: 300 };
await FirebaseAPI.firestore.clientes.addItemToSolicitacao(ClienteID, solicitacaoId, itemSolicitado);
*/
export async function addItemToSolicitacao(clienteId, solicitacaoId, itemData) {
  const solicitacaoRef = doc(firestore, 'Clientes', clienteId, 'solicitacoes', solicitacaoId);
  await updateDoc(solicitacaoRef, {
    itensSolicitados: arrayUnion(itemData)
  });
}

/* Atualiza um item específico dentro do array 'itensSolicitados' de uma solicitação. Exemplo:
await FirebaseAPI.firestore.clientes.updateItemEmSolicitacao(ClienteID, solicitacaoId, 'item_xyz_012', { precoUnitario: 100 });
*/
export async function updateItemEmSolicitacao(clienteId, solicitacaoId, itemIdToUpdate, newItemData) {
  const solicitacaoRef = doc(firestore, 'Clientes', clienteId, 'solicitacoes', solicitacaoId);

  const solicitacaoSnap = await getDoc(solicitacaoRef);
  if (!solicitacaoSnap.exists()) {
    throw new Error("Solicitação não encontrada.");
  }

  const solicitacao = solicitacaoSnap.data();
  const itensSolicitados = solicitacao.itensSolicitados;
  const updatedItens = itensSolicitados.map(item => {
    if (item.id === itemIdToUpdate) {
      return { ...item, ...newItemData };
    }
    return item;
  });

  await updateDoc(solicitacaoRef, {
    itensSolicitados: updatedItens
  });
}

/* Remove um item específico do array 'itensSolicitados' de um agendamento. Exemplo:
await FirebaseAPI.firestore.clientes.removeItemEmSolicitacao(ClienteID, solicitacaoId, 'item_xyz_012');
*/
export async function removeItemEmSolicitacao(clienteId, solicitacaoId, itemIdToRemove) {
  const solicitacaoRef = doc(firestore, 'Clientes', clienteId, 'solicitacoes', solicitacaoId);

  const solicitacaoSnap = await getDoc(solicitacaoRef);
  if (!solicitacaoSnap.exists()) {
    throw new Error("Agendamento não encontrado.");
  }

  const solicitacao = solicitacaoSnap.data();
  const itens = solicitacao.itensSolicitados || [];
  const updatedItens = itens.filter(item => item.id!== itemIdToRemove);

  await updateDoc(solicitacaoRef, {
    itensSolicitados: updatedItens
  });
}