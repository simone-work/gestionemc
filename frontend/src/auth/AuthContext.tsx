import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string; // ID Discord 
  username: string; // nome Discord
  avatarUrl: string; // L'URL all'avatar dell'utente
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Il browser invia automaticamente il cookie, il backend lo valida.
                const response = await axios.get('/api/auth/me');
                
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // Se la chiamata fallisce (es. 401 per token non valido/scaduto),
                // l'utente non è autenticato.
                console.error("Check auth status failed:", error);
                setUser(null);
            } finally {
                // In ogni caso, il caricamento iniziale è terminato.
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []); // L'array vuoto [] assicura che questo venga eseguito solo una volta all'avvio.

    // Questa funzione viene chiamata dopo che il flusso OAuth2 di Discord
    // è terminato con successo e il frontend ha recuperato i dati utente.
    const login = (userData: User) => {
        setUser(userData);
    };

    // Questa funzione chiama il backend per invalidare il cookie e pulisce lo stato locale.
    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error("Logout failed:", error);
            // Continuiamo con il logout sul frontend anche se la chiamata fallisce
        } finally {
            setUser(null);
        }
    };

    // Finché non sappiamo se l'utente è loggato o no, mostriamo uno stato di caricamento.
    // Questo previene un "flash" in cui un utente loggato vede brevemente la pagina di login.
    if (loading) {
        return <div>Caricamento sessione...</div>;
    }

    // Il Provider rende disponibili lo stato e le funzioni a tutta l'applicazione.
    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizzato per un accesso più semplice e sicuro al contesto.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
