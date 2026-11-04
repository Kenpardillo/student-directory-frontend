import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const isAuthenticated = Boolean(token);

    // Login function
    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Invalid credentials');
        }

        localStorage.setItem('token', data.token);
        setToken(data.token);

        const loggedInUser = data.user || { email };
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        return data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom authentication hook
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
