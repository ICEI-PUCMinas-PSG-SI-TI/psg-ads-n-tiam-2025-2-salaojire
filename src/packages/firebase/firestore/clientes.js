import { collection, doc, getDoc, updateDoc, addDoc, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../config';

//Lembrem de usar try e catch quando for usar a API

/* Busca os dados de um cliente específico. Exemplo:
const cliente = await FirebaseAPI.firestore.clientes.getCliente(ClienteID);
*/
export async function getCliente(clienteId) {
  const docRef = doc(firestore, 'Clientes', clienteId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

// AGENDAMENTOS

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