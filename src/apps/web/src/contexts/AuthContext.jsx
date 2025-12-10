import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseAPI from '@packages/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(async currentUser => {
            
            // Se não estiver logado → limpar estados
            if (!currentUser) {
                setUser(null);
                setCliente(null);
                setLoading(false);
                return;
            }

            // Salva o usuário do Firebase
            setUser(currentUser);

            // Busca o cliente no Firestore
            const clienteFirestore = await FirebaseAPI.firestore.clientes.getCliente(currentUser.uid);
            setCliente(clienteFirestore);

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const valor = {
        user,
        cliente,
        signed: !!user,
        loading,
        logout: () => FirebaseAPI.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
