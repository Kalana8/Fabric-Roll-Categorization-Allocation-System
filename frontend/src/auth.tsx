import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type AuthContextType = {
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem('auth_token'));
    }, []);

    const login = async (username: string, password: string) => {
        // simple demo auth: accept any non-empty creds
        if (username && password) {
            const t = `demo-${Date.now()}`;
            localStorage.setItem('auth_token', t);
            setToken(t);
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
    };

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const location = useLocation();
    if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
    return <>{children}</>;
}


