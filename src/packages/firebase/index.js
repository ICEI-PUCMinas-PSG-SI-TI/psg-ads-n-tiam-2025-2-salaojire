import * as auth from './auth';
import * as storage from './storage';
import * as administradores from './firestore/administradores';
import * as clientes from './firestore/clientes';
import * as itens from './firestore/itens';

export default {
  auth,
  storage,
  firestore: {
    administradores,
    clientes,
    itens,
  },
};