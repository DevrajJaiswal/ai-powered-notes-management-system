import { createContext, useContext, useEffect, useState } from 'react';
import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            setLoading(false);
            return;
        }

        getCurrentUser()
            .then((data) => {
                setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem('auth_token');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        localStorage.setItem('auth_token', data.token);
        setUser(data.user);

        return data;
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);