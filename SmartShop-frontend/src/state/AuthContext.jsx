import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user info is stored in sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const userData = await authService.login(username, password);
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            sessionStorage.removeItem('user');
        }
    };

    const isAdmin = () => user?.role === 'ADMIN';
    const isClient = () => user?.role === 'CLIENT';
    const isAuthenticated = () => !!user;

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin,
        isClient,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
