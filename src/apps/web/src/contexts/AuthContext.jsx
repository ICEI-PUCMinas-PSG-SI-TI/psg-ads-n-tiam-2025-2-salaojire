import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseAPI from '@packages/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(async currentUser => {
            if (!currentUser) {
                setUser(null);
                setCliente(null);
                setLoading(false);
                return;
            }

            const clienteFirestore = await FirebaseAPI.firestore.clientes.getCliente(currentUser.uid);
            setUser(clienteFirestore);

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const valor = {
        user,
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
