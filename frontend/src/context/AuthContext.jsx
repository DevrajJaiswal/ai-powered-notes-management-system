import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(user);

    useEffect(() => {
        const handleUnauthorized = () => {
            localStorage.removeItem('auth_token');
            setUser(null);
        };

        window.addEventListener(
            'auth:unauthorized',
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                'auth:unauthorized',
                handleUnauthorized
            );
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            setLoading(false);
            return;
        }

        const restoreSession = async () => {
            try {
                const data = await getCurrentUser();

                setUser(data.user);
            } catch (error) {
                console.error(
                    'Unable to restore session:',
                    error
                );

                localStorage.removeItem('auth_token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        localStorage.setItem(
            'auth_token',
            data.token
        );

        setUser(data.user);

        return data;
    };

    const register = async (credentials) => {
        const data = await registerRequest(credentials);

        localStorage.setItem(
            'auth_token',
            data.token
        );

        setUser(data.user);

        return data;
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error(
                'Logout request failed:',
                error
            );
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
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside an AuthProvider.'
        );
    }

    return context;
};
