import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './config';

//Lembrem de usar try e catch quando for usar a API

/* Cadastra cliente. Exemplo:
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

/**
 * Registra um novo administrador.
 * Requer uma Cloud Function para definir o Custom Claim 'admin'.
 * @param {object} adminData - Dados do admin, incluindo email, senha, nome, nivel.
 * @returns {Promise<object>} O objeto do usuário autenticado.
 */
export async function signUpAdmin({ email, senha, nome, nivel }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    const perfilData = {
      id: user.uid,
      email,
      nome,
      nivel, // 'SUPER' ou 'ADMIN'
    };

    // A criação deste documento acionará a Cloud Function para definir o Custom Claim.
    await setDoc(doc(firestore, 'Administradores', user.uid), perfilData);
    return user;
  } catch (error) {
    console.error("Erro ao registrar administrador:", error);
    throw new Error(`Falha no registro de admin: ${error.code}`);
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