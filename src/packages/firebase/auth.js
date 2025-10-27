import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuthStateChanged, getAuth} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from './config';
import { initializeApp, deleteApp } from 'firebase/app';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';


//Lembrem de usar try e catch quando for usar a API

/* Cadastra e loga em uma nova conta cliente. Exemplo:
const clienteData = {
  email: "test@gmail.com",
  senha: "Test123", 
  nome: 'Cliente de Teste',
  telefone: '123456789',
};
await FirebaseAPI.auth.signUpCliente(clienteData);
*/
export async function signUpCliente({ email, senha, nome, telefone }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Remove a senha do objeto antes de salvar no Firestore
    const perfilData = {
      id: user.uid,
      email,
      nome,
      telefone,
      agendamentos: [],
      solicitacoes: [],
    };

    await setDoc(doc(firestore, 'Clientes', user.uid), perfilData);
    return user;
  } catch (error) {
    console.error("Erro ao registrar cliente:", error);
    throw new Error(`Falha no registro: ${error.code}`);
  }
}

/* Cadastra um cliente sem logar na conta dele. Exemplo:
const clienteData = {
  email: "test@gmail.com",
  senha: "Test123",
  nome: 'Cliente de Teste',
  telefone: '123456789',
};
await FirebaseAPI.auth.createClienteAsAdmin(clienteData);
*/
export async function createClienteAsAdmin({ email, senha, nome, telefone }) {
  const tempAppName = `auth-worker-${Date.now()}`;
  let secondaryApp;

  try {
    const mainAppConfig = auth.app.options;
    secondaryApp = initializeApp(mainAppConfig, tempAppName);
    const secondaryAuth = getAuth(secondaryApp);
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, senha);
    const newUser = userCredential.user;

    const perfilData = {
      id: newUser.uid,
      email,
      nome,
      telefone,
      agendamentos: [],
      solicitacoes: [],
    };
    await setDoc(doc(firestore, 'Clientes', newUser.uid), perfilData);
    await firebaseSignOut(secondaryAuth);
    return { uid: newUser.uid, email: newUser.email };
  } catch (error) {
    console.error("Erro ao criar cliente como admin:", error);
    throw new Error(`Falha no registro pelo admin: ${error.code}`);
  } finally {
    if (secondaryApp) {
      await deleteApp(secondaryApp);
    }
  }
}

/* Cadastra um admin sem logar na conta dele. Exemplo:
const adminData = {
  email: "admin@gmail.com",
  senha: "Admin123",
  nome: 'Admin de Teste',
  nivel: 'SUPER',
};
await FirebaseAPI.auth.signUpAdmin(adminData);
*/
export async function signUpAdmin({ email, senha, nome, nivel }) {
  const tempAppName = `auth-worker-${Date.now()}`;
  let secondaryApp;

  try {
    const mainAppConfig = auth.app.options;
    secondaryApp = initializeApp(mainAppConfig, tempAppName);
    const secondaryAuth = getAuth(secondaryApp);
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, senha);
    const newUser = userCredential.user;

    const perfilData = {
      id: newUser.uid,
      email,
      nome,
      nivel, // 'SUPER' ou 'ADMIN'
    };

    await setDoc(doc(firestore, 'Administradores', newUser.uid), perfilData);
    await firebaseSignOut(secondaryAuth);
    return { uid: newUser.uid, email: newUser.email };
  } catch (error) {
    console.error("Erro ao criar admin:", error);
    throw new Error(`Falha no registro pelo admin: ${error.code}`);
  } finally {
    if (secondaryApp) {
      await deleteApp(secondaryApp);
    }
  }
}

/* Realiza o login. Exemplo:
await FirebaseAPI.auth.signIn("test@gmail.com", "Test123");
*/
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Email ou senha inválidos.');
    }
    throw new Error('Ocorreu um erro ao tentar fazer login.');
  }
}

/* Realiza o logout. Exemplo:
await FirebaseAPI.auth.signOut();
*/
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw new Error('Falha ao tentar sair.');
  }
}

// EXCLUSÕES: Por enquanto está apenas deletando o perfil no banco de dados, não do Firebase Authentication

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

/* Evento disparado quando a autenticação muda. Usado para definir o usuário atual, exemplo:
const [user, setUser] = useState(null);

// Efeito para escutar as mudanças
useEffect(() => {
  // A função onAuthStateChanged retorna uma função 'unsubscribe'
  const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(currentUser => {
    setUser(currentUser);
  });

  // Para de ouvir as mudanças quando o componente for desmontado
  return unsubscribe;
},);
*/
export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback);
}
/* Redefine a senha com reautenticação. Exemplo:*/
export async function sendResetEmail(email) {
  try {
    console.log("Enviando email de redefinição para:", email);
    
    // Chama a função REAL do Firebase
    await sendPasswordResetEmail(auth, email);
    
    console.log("Email de redefinição enviado com sucesso!");
    return true;
    
  } catch (error) {
    console.error("Erro REAL ao enviar email:", error);
    
    // Tratamento de erros específicos do Firebase
    if (error.code === 'auth/user-not-found') {
      throw new Error('Email não encontrado em nosso sistema.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('O formato do email é inválido.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Muitas tentativas. Tente novamente mais tarde.');
    } else {
      throw new Error('Erro ao enviar email: ' + error.message);
    }
  }
}

