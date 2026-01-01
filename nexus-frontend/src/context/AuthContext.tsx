import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, isAuthenticated as checkAuth } from '../coding-challenge/services/authService';
import type { AuthUser } from '../coding-challenge/services/authService';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated on mount
        const authenticated = checkAuth();
        if (authenticated) {
            // Try to get user info from localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse stored user:', e);
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const response = await loginService(username, password);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const register = async (username: string, email: string, password: string) => {
        const response = await registerService(username, email, password);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const logout = () => {
        logoutService();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
