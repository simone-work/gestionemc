import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    isAdmin: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void; // Riferimento alla funzione di login
    logout: () => Promise<void>; // Riferimento alla funzione di logout
}

// Creiamo il "contenitore" (il Context). All'inizio è vuoto (undefined).
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Questo è il componente principale che fornirà i dati a tutta l'applicazione [AuthProvider è un componente].
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Creo la funzione
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('/api/auth/me');
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        // 2. Chiamo la funzione
        checkAuthStatus();
    }, []); // L'array vuoto [] assicura che questo useEffect venga eseguito solo una volta.

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } finally {
            setUser(null);
        }
    };

    if (loading) {
        return <div>Caricamento...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
            {/*
                Qui diciamo a React:
                "Ok, prima crea il mio 'Provider' che rende disponibili i dati di autenticazione,
                e POI, al suo interno, renderizza i 'figli' che mi sono stati passati".
            */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth non può essere usato senza un AuthProvider');
    }
    return context;
};